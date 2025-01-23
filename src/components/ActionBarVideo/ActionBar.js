import classNames from "classnames/bind";
import PropTypes from "prop-types";
import styles from './ActionBar.module.scss';
import Avatar from "@/components/Avatar";
import { CommentIcon, FavoritesIcon, LikeIcon, PlusIcon, ShareIcon, TickedIcon } from "@/components/Icons";
import { useState } from "react";
import { NumberFormatter } from "../NumberFormatter";

const cx = classNames.bind(styles)

function ActionBar({
    video,
    className }) {
    const [Liked, setLike] = useState(video.is_liked);
    const [Saved, setSave] = useState(false);
    const [following, setFollowing] = useState(video.user.is_followed);

    const handleLike = () => {
        setLike(!Liked);
    }
    const handleSave = () => {
        setSave(!Saved);
    }

    const handleFollow = () => {
        setFollowing(!following);
    }
    return (
        <section className={cx('actionBar-container', {
            [className]: className
        })}>
            <div className={cx('actionBar-item')}>
                <Avatar image={video.user.avatar} dataSize="1em" altValue={video.thumb_url} />
                <button className={cx('actionBar-item__btn-following', {
                    following: following
                })}
                    onClick={
                        handleFollow
                    }

                >{(following && <TickedIcon width="0.6em" height="0.6em" />) || <PlusIcon width="0.6em" height="0.6em" />}</button>
            </div>
            <div className={cx('actionBar-item')}>
                <button
                    type="button"
                    className={cx('actionBar-item__btn', { liked: Liked })}
                    onClick={handleLike}
                >
                    <LikeIcon width="0.6em" height="0.6em" />
                </button>
                <strong className={cx('actionBar-item__value')}>
                    {video.likes_count ? (
                        <NumberFormatter value={video.likes_count} />
                    ) : (
                        'likes'
                    )}
                </strong>
            </div>
            <div className={cx('actionBar-item')}>
                <button type="button" className={cx('actionBar-item__btn')}>
                    <CommentIcon width="0.6em" height="0.6em" />
                </button>
                <strong className={cx('actionBar-item__value')}>
                    {video.comments_count ? (
                        <NumberFormatter value={video.comments_count} />
                    ) : (
                        'comments'
                    )}
                </strong>
            </div>
            <div className={cx('actionBar-item')}>
                <button
                    type="button"
                    className={cx('actionBar-item__btn', { saved: Saved })}
                    onClick={handleSave}
                >
                    <FavoritesIcon width="0.6em" />
                </button>
                <strong className={cx('actionBar-item__value')}>
                    {video.views_count ? (
                        <NumberFormatter value={video.views_count} />
                    ) : (
                        'save'
                    )}
                </strong>
            </div>
            <div className={cx('actionBar-item')}>
                <button type="button" className={cx('actionBar-item__btn')}>
                    <ShareIcon width="0.6em" height="0.6em" />
                </button>
                <strong className={cx('actionBar-item__value')}>
                    {video.shares_count ? (
                        <NumberFormatter value={video.shares_count } />
                    ) : (
                        'share'
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