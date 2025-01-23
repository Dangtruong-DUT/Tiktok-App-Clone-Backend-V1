import React from "react";
import styles from "./VideoPage.module.scss";
import classNames from "classnames/bind";
import { VideoInfo } from "./Components/VideoInfo";
import { CommentsSection } from "./Components/CommentsSection";

const cx = classNames.bind(styles);

const VideoPage = () => {
    return (
        <div className={cx('videoPage')}>dddddđ
            <div className={cx('videoPlayer')}>
                {/* Video player component goes here */}
            </div>
            <div className={cx('listComment')}>
                <VideoInfo />
                <CommentsSection />
            </div>
        </div>
    );
};

export default VideoPage;
