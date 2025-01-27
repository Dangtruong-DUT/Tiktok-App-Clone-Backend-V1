import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./ActionBar.module.scss";
import Avatar from "@/components/Avatar";
import {
    CommentIcon,
    FavoritesIcon,
    LikeIcon,
    PlusIcon,
    ShareIcon,
    TickedIcon
} from "@/components/Icons";
import { NumberFormatter } from "../NumberFormatter";
import { ActionButton } from "../ActionButton";

const cx = classNames.bind(styles);

function ActionBar({ video, className }) {
    const [Liked, setLiked] = useState(video.is_liked);
    const [Saved, setSaved] = useState(false);
    const [Following, setFollowing] = useState(video.user.is_followed);

    const handleLike = () => setLiked(!Liked);
    const handleSave = () => setSaved(!Saved);
    const handleFollow = () => setFollowing(!Following);

    return (
        <section className={cx("actionBar-container", className)}>
            <div className={cx("actionBar-item")}>
                <Avatar image={video.user.avatar} dataSize="1em" altValue={video.thumb_url} />
                <ActionButton
                    icon={Following ? TickedIcon : PlusIcon}
                    onClick={handleFollow}
                    isActive={Following}
                    activeClass={cx("following")}
                    iconSize="0.4em"
                    className={cx('actionBar-item__btn-following')}
                />
            </div>
            <div className={cx("actionBar-item")}>
                <ActionButton
                    icon={LikeIcon}
                    onClick={handleLike}
                    isActive={Liked}
                    activeClass={cx("liked")}
                    iconSize="0.6em"
                    className={cx('actionBar-item__btn')}
                />
                <strong className={cx("actionBar-item__value")}>
                    {video.likes_count ? (
                        <NumberFormatter value={video.likes_count} />
                    ) : (
                        "likes"
                    )}
                </strong>
            </div>
            <div className={cx("actionBar-item")}>
                <ActionButton
                    icon={CommentIcon}
                    onClick={() => { }}
                    iconSize="0.6em"
                    className={cx('actionBar-item__btn')}
                />
                <strong className={cx("actionBar-item__value")}>
                    {video.comments_count ? (
                        <NumberFormatter value={video.comments_count} />
                    ) : (
                        "comments"
                    )}
                </strong>
            </div>
            <div className={cx("actionBar-item")}>
                <ActionButton
                    icon={FavoritesIcon}
                    onClick={handleSave}
                    isActive={Saved}
                    activeClass={cx("saved")}
                    iconSize="0.6em"
                    className={cx('actionBar-item__btn')}
                />
                <strong className={cx("actionBar-item__value")}>
                    {video.views_count ? (
                        <NumberFormatter value={video.views_count} />
                    ) : (
                        "save"
                    )}
                </strong>
            </div>
            <div className={cx("actionBar-item")}>
                <ActionButton
                    icon={ShareIcon}
                    onClick={() => { }}
                    iconSize="0.6em"
                    className={cx('actionBar-item__btn')}
                />
                <strong className={cx("actionBar-item__value")}>
                    {video.shares_count ? (
                        <NumberFormatter value={video.shares_count} />
                    ) : (
                        "share"
                    )}
                </strong>
            </div>
        </section>
    );
}

ActionBar.propTypes = {
    video: PropTypes.object.isRequired,
    className: PropTypes.string,
};

export default ActionBar;
