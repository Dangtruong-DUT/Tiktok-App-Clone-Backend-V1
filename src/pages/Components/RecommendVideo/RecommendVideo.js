import classNames from "classnames/bind";
import styles from './RecommendVideo.module.scss';
import { memo } from "react";
import { Video } from "@/components/VideoPlayer";
import { ActionBar } from "../ActionBar";

const cx = classNames.bind(styles);

function RecommendVideo({ videos, videoRefs, onWheel }) {
    return (
        <section className={cx('recommend-videos')} onWheel={onWheel}>
            {videos.map((video, index) => (
                <article key={index} className={cx('video-content')} ref={(el) => (videoRefs.current[index] = el)}>
                    <div className={cx('videoCenterViewPort')}>
                        <Video sources={video} className={cx('video')} />
                        <ActionBar
                            video={video}
                        />
                    </div>
                </article>
            ))}
        </section>
    );
}

export default memo(RecommendVideo);
