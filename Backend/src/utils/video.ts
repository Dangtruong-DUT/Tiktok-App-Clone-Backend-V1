/**
 * Converts a video to HLS format with multiple streams.
 * @param {string} videoPath - Path to the video file.
 * @returns {Promise} - A promise that resolves with the HLS format of the video.
 * @note Requires ffmpeg, `slash`, `promisify`, and `exec` libraries.
 * @warning Ensure compatibility with your OS to avoid errors like "No quote function is defined".
 */
import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execPromise = promisify(exec)

const MAXIMUM_BITRATE_720P = 5 * 10 ** 6 // 5Mbps
const MAXIMUM_BITRATE_1080P = 8 * 10 ** 6 // 8Mbps
const MAXIMUM_BITRATE_1440P = 16 * 10 ** 6 // 16Mbps

export const checkVideoHasAudio = async (filePath: string) => {
    const slash = (await import('slash')).default
    const { stdout } = await execPromise(
        `ffprobe ${[
            '-v',
            'error',
            '-select_streams',
            'a:0',
            '-show_entries',
            'stream=codec_type',
            '-of',
            'default=nw=1:nk=1',
            slash(filePath)
        ].join(' ')}`
    )
    return stdout.trim() === 'audio'
}

const getBitrate = async (filePath: string) => {
    const slash = (await import('slash')).default
    const { stdout } = await execPromise(
        `ffprobe ${[
            '-v',
            'error',
            '-select_streams',
            'v:0',
            '-show_entries',
            'stream=bit_rate',
            '-of',
            'default=nw=1:nk=1',
            slash(filePath)
        ].join(' ')}`
    )
    return Number(stdout.trim())
}

const getResolution = async (filePath: string) => {
    const slash = (await import('slash')).default
    const { stdout } = await execPromise(
        `ffprobe ${[
            '-v',
            'error',
            '-select_streams',
            'v:0',
            '-show_entries',
            'stream=width,height',
            '-of',
            'csv=s=x:p=0',
            slash(filePath)
        ].join(' ')}`
    )
    const resolution = stdout.trim().split('x')
    const [width, height] = resolution
    return {
        width: Number(width),
        height: Number(height)
    }
}

const getWidth = (height: number, resolution: { width: number; height: number }) => {
    const width = Math.round((height * resolution.width) / resolution.height)
    return width % 2 === 0 ? width : width + 1
}

type EncodeByResolution = {
    inputPath: string
    isHasAudio: boolean
    resolution: { width: number; height: number }
    outputSegmentPath: string // Đã là template
    outputPath: string // Đã là template
    bitrate: {
        720: number
        1080: number
        1440: number
        original: number
    }
}

const encode = async ({
    bitrate,
    inputPath,
    isHasAudio,
    outputPath,
    outputSegmentPath,
    resolution,
    streamIndex
}: EncodeByResolution & { streamIndex: number }) => {
    const slash = (await import('slash')).default
    const actualOutputPath = outputPath.replace('%v', `${streamIndex}`)
    const actualSegmentPath = outputSegmentPath.replace('%v', `${streamIndex}`)
    const targetResolution = [720, 1080, 1440, resolution.height][streamIndex]
    const width = getWidth(targetResolution, resolution)

    const args = [
        '-y',
        '-i',
        slash(inputPath),
        '-preset',
        'veryslow',
        '-g',
        '48',
        '-crf',
        '17',
        '-sc_threshold',
        '0',
        '-map',
        '0:0'
    ]

    if (isHasAudio) {
        args.push('-map', '0:1')
    }

    args.push(
        '-s:v:0',
        `${width}x${targetResolution}`,
        '-c:v:0',
        'libx264',
        '-b:v:0',
        `${bitrate[targetResolution as 720 | 1080 | 1440] || bitrate.original}`,
        '-c:a',
        'copy',
        '-var_stream_map'
    )

    if (isHasAudio) {
        args.push('v:0,a:0')
    } else {
        args.push('v:0')
    }

    args.push(
        '-master_pl_name',
        'master.m3u8',
        '-f',
        'hls',
        '-hls_time',
        '6',
        '-hls_list_size',
        '0',
        '-hls_segment_filename',
        slash(actualSegmentPath),
        slash(actualOutputPath)
    )

    try {
        await fs.mkdir(path.dirname(actualOutputPath), { recursive: true })
    } catch (error) {
        console.error('Lỗi tạo thư mục:', error)
        return false
    }

    await execPromise(`ffmpeg ${args.join(' ')}`)
    return true
}

export const encodeHLSWithMultipleVideoStreams = async (inputPath: string) => {
    const [bitrateValue, resolution] = await Promise.all([getBitrate(inputPath), getResolution(inputPath)])
    const bitrate = {
        720: Math.min(bitrateValue, MAXIMUM_BITRATE_720P),
        1080: Math.min(bitrateValue, MAXIMUM_BITRATE_1080P),
        1440: Math.min(bitrateValue, MAXIMUM_BITRATE_1440P),
        original: bitrateValue
    }
    const isHasAudio = await checkVideoHasAudio(inputPath)
    const parent_folder = path.join(inputPath, '..')

    // Thay đổi quan trọng: outputPath và outputSegmentPath bây giờ trỏ đến thư mục con
    const outputPath = path.join(parent_folder, 'v%v/prog_index.m3u8')
    const outputSegmentPath = path.join(parent_folder, 'v%v/fileSequence%d.ts')

    const resolutions = [720]
    if (resolution.height > 720) resolutions.push(1080)
    if (resolution.height > 1080) resolutions.push(1440)
    if (resolution.height > 1440) resolutions.push(resolution.height)

    const masterPlaylistPath = path.join(parent_folder, 'master.m3u8') // Đường dẫn đến master playlist

    let masterPlaylistContent = '#EXTM3U\n' // Khởi tạo nội dung master playlist

    for (let i = 0; i < resolutions.length; i++) {
        const res = resolutions[i]
        const result = await encode({
            bitrate,
            inputPath,
            isHasAudio,
            outputPath,
            outputSegmentPath,
            resolution,
            streamIndex: i
        })

        if (!result) {
            console.error(`Encode v${i} thất bại!`)
            return false
        }

        // Thêm thông tin về playlist con vào master playlist
        masterPlaylistContent += `#EXT-X-MEDIA:TYPE=VIDEO,GROUP-ID="res${res}",NAME="${res}p",AUTOSELECT=YES,DEFAULT=YES\n`
        masterPlaylistContent += `#EXT-X-STREAM-INF:BANDWIDTH=${bitrate[res as 720 | 1080 | 1440]},RESOLUTION=${getWidth(res, resolution)}x${res}\n`
        masterPlaylistContent += `v${i}/prog_index.m3u8\n`
    }

    // Ghi nội dung master playlist vào file
    try {
        await fs.writeFile(masterPlaylistPath, masterPlaylistContent)
    } catch (error) {
        return false
    }

    return true
}
