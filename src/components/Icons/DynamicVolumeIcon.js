function DynamicVolumeIcon({ className, width = '3.2rem', height = '3.2rem', color = 'currentColor', isMuted = false }) {
    return (
        isMuted ?
            <svg xmlns="http://www.w3.org/2000/svg" className={className} width={width} height={height} viewBox="0 0 24 24">
                <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <path fill={color} d="M4 10h3.5l3.5 -3.5v10.5l-3.5 -3.5h-3.5Z" />
                    <path strokeDasharray="8" stroke-dashoffset="8" d="M16 10l4 4">
                        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0s" dur="0.2s" values="8;0" />
                    </path>
                    <path stroke-dasharray="8" stroke-dashoffset="8" d="M20 10l-4 4">
                        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="8;0" />
                    </path>
                </g>
            </svg>
            : <svg xmlns="http://www.w3.org/2000/svg" className={className} width={width} height={height} viewBox="0 0 24 24">
                <g fill={color}>
                    <path d="M14 12c0 0 0 0 0 0c0 0 0 0 0 0Z">
                        <animate fill="freeze" attributeName="d" begin="0s" dur="0.2s" values="M14 12c0 0 0 0 0 0c0 0 0 0 0 0Z;M14 16c1.5 -0.71 2.5 -2.24 2.5 -4c0 -1.77 -1 -3.26 -2.5 -4Z" /></path>
                    <path d="M14 12c0 0 0 0 0 0c0 0 0 0 0 0v0c0 0 0 0 0 0c0 0 0 0 0 0Z">
                        <animate fill="freeze" attributeName="d" begin="0s" dur="0.4s" values="M14 12c0 0 0 0 0 0c0 0 0 0 0 0v0c0 0 0 0 0 0c0 0 0 0 0 0Z;M14 3.23c4 0.91 7 4.49 7 8.77c0 4.28 -3 7.86 -7 8.77v-2.07c2.89
                         -0.86 5 -3.53 5 -6.7c0 -3.17 -2.11 -5.85 -5 -6.71Z" /></path></g>
                <path fill={color} fillOpacity="0" stroke={color} strokeDasharray="32" strokeDashoffset="32" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h3.5l3.5 -3.5v10.5l-3.5 -3.5h-3.5Z">
                    <animate fill="freeze" attributeName="fill-opacity" begin="0s" dur="0.5s" values="0;1" />
                    </path>
            </svg>

    );
}

export default DynamicVolumeIcon;