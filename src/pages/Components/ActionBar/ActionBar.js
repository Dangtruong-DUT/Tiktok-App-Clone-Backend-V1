import classNames from "classnames/bind";
import PropTypes from "prop-types";
import styles from './ActionBar.module.scss';
import Avatar from "@/components/Avatar";
import { CommentIcon, FavoritesIcon, LikeIcon, PlusIcon, ShareIcon, TickedIcon } from "@/components/Icons";
import { useState } from "react";

const cx = classNames.bind(styles)

function ActionBar(
    video,
    className) {
    const [Liked, setLike] = useState(false);
    const [Saved, setSave] = useState(false);

    const handleLike = () => {
        setLike(!Liked);
    }
    const handleSave = () => {
        setSave(!Saved);
    }

    video = video.video;
    return (
        <section className={cx('actionBar-container', {
            [className]: className
        })}>
            <div className={cx('actionBar-item')}>
                <Avatar image={video.avatarUrl} dataSize="1em" altValue={video.author} />
                <button className={cx('actionBar-item__btn-following')}>{(video.following && <TickedIcon width="2em" height="2em" />) || <PlusIcon width="0.6em" height="0.6em" />}</button>
            </div>
            <div className={cx('actionBar-item')}>
                <button
                    type="button"
                    className={cx('actionBar-item__btn', { liked: Liked })}
                    onClick={handleLike}
                >
                    <LikeIcon width="0.6em" height="0.6em" />
                </button>
                <strong className={cx('actionBar-item__value')}>{video.likes || 'likes'}</strong>
            </div>
            <div className={cx('actionBar-item')}>
                <button type="button" className={cx('actionBar-item__btn')}>
                    <CommentIcon width="0.6em" height="0.6em" />
                </button>
                <strong className={cx('actionBar-item__value')}>{video.comments || 'comments'}</strong>
            </div>
            <div className={cx('actionBar-item')}>
                <button
                    type="button"
                    className={cx('actionBar-item__btn', { saved: Saved })}
                    onClick={handleSave}
                >
                    <FavoritesIcon width="0.6em" />
                </button>
                <strong className={cx('actionBar-item__value')}>{video.save || 'save'}</strong>
            </div>
            <div className={cx('actionBar-item')}>
                <button type="button" className={cx('actionBar-item__btn')}>
                    <ShareIcon width="0.6em" height="0.6em" />
                </button>
                <strong className={cx('actionBar-item__value')}>{video.share || 'share'}</strong>
            </div>
        </section>
    );
}

ActionBar.propTypes = {
    video: PropTypes.object.isRequired,
    className: PropTypes.string,
};

export default ActionBar;