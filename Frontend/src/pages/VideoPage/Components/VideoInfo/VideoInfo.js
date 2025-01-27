import React, { useState } from "react";
import styles from "./VideoInfo.module.scss";
import classNames from "classnames/bind";
import { ActionBar } from "./ActionBar";
import { ProfileAuthor } from "./ProfileAuthor";


const cx = classNames.bind(styles);



const VideoInfo = ({ video }) => {
    const [Liked, setLike] = useState(false);
    const [Saved, setSave] = useState(false);
    const [following, setFollowing] = useState(false);

    const handleLike = () => {
        setLike(!Liked);
    };

    const handleSave = () => {
        setSave(!Saved);
    };

    const handleFollow = () => {
        setFollowing(!following);
    };

    return (
        <div className={cx("wrapper")}>
            <ProfileAuthor following={following} handleFollow={handleFollow} />
            <ActionBar
                Liked={Liked}
                Saved={Saved}
                handleLike={handleLike}
                handleSave={handleSave}
                video={video}
            />
        </div>
    );
};

export default VideoInfo;
