import { PlayIcon } from '@/components/Icons';
import styles from './VideoGrid.module.scss';
import classNames from 'classnames/bind';
import LockIcon from '@/components/Icons/LogIcon';

const cx = classNames.bind(styles);
function VideoItem({ videoPlayer }) {
    return (
        <div className={cx('video-container')}>
            <div className={cx('video')}>
                <div className={cx('video__thumbnail')}>
                    <picture >
                        <img src={videoPlayer.thumb_url} alt="" />
                    </picture>
                </div>
                <div className={cx('video__player')}>
                    <video autoPlay muted playsInline loop>
                        <source src={videoPlayer.file_url} />
                    </video>
                </div>
                <div className={cx('video-player__footer')}>
                    <div className={cx('video-footer__left')}>
                        <PlayIcon className={cx('video-footer__icon')} width='18' height='18' regular />
                        <span className={cx('video-footer__heading')}>{videoPlayer.views_count}</span>
                    </div>
                    {videoPlayer.viewable !== 'public' &&
                        <LockIcon className={cx('video-footer__icon')} />}
                </div>
            </div>
        </div >
    );
}

export default VideoItem;