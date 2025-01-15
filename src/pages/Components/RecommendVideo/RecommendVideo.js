import classNames from "classnames/bind";
import styles from './RecommendVideo.module.scss';
import { memo } from "react";
import { Video } from "@/components/Video";

const cx = classNames.bind(styles);

function RecommendVideo({ videos, videoRefs }) {
    return (
        <article className={cx('recommend-videos')}>
            {videos.map((video, index) => (
                <div key={index} className={cx('video-content')} ref={(el) => (videoRefs.current[index] = el)}>
                    <Video sources={video} className={cx('video')} />
                </div>
            ))}
        </article>
    );
}

export default memo(RecommendVideo);
