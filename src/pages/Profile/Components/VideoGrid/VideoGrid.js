import styles from './VideoGrid.module.scss';
import classNames from 'classnames/bind';
import VideoItem from './VideoItem';

const cx = classNames.bind(styles);

function VideoGrid({ videos }) {
    return (
        <div className={cx('gridContainer')}>
            <div className={cx('VideosGrid')}>
                {videos.map((video, index) => (
                    <div key={index} className={cx('VideosGrid__video')}>
                        <VideoItem videoPlayer={video}/>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VideoGrid;
