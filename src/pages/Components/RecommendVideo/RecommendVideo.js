import classNames from "classnames/bind";
import styles from './RecommendVideo.module.scss';
import { memo } from "react";
import { Video } from "@/components/Video";
import { ActionBar } from "../ActionBar";

const cx = classNames.bind(styles);

function RecommendVideo({ videos, videoRefs }) {
    return (
        <article className={cx('recommend-videos')}>
            <div className={cx('list-video')}>
                {videos.map((video, index) => (
                    <div key={index} className={cx('video-content')} ref={(el) => (videoRefs.current[index] = el)}>
                        <Video sources={video} className={cx('video')} />
                        <ActionBar
                            video={video}
                        />
                    </div>
                ))}
            </div>
        </article>
    );
}

export default memo(RecommendVideo);
