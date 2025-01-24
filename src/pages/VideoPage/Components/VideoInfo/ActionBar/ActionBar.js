import React from "react";
import styles from "./ActionBar.module.scss";
import classNames from "classnames/bind";
import {
    CommentIcon,
    EmbedIcon,
    FacebookIcon,
    FavoritesIcon,
    LetterIcon,
    LikeIcon,
    ShareIcon,
} from "@/components/Icons";
import { ActionButton } from "@/components/ActionButton";

const cx = classNames.bind(styles);

function ActionBarItem({ icon, onClick, value, isActive, activeClass }) {
    return (
        <div className={cx("actionBar-item")}>
            <ActionButton
                icon={icon}
                onClick={onClick}
                isActive={isActive}
                activeClass={activeClass}
                iconSize="0.6em"
                className={cx('transitionBGC')}
            />
            <strong className={cx("actionBar-item__value")}>{value}</strong>
        </div>
    );
}

function ShareButton({ icon: Icon }) {
    return (
        <button type="button" className={cx("shareIcon")}>
            <Icon />
        </button>
    );
}
function ActionBar({ Liked, Saved, handleLike, handleSave, video }) {
    return (
        <div className={cx("ActionBar")}>
            <div className={cx("ActionBar__blockLeft")}>
                <ActionBarItem
                    icon={LikeIcon}
                    onClick={handleLike}
                    value={video?.likes_count || "likes"}
                    isActive={Liked}
                    activeClass="liked"
                />
                <ActionBarItem
                    icon={CommentIcon}
                    onClick={null}
                    value={video?.comments_count || "comments"}
                />
                <ActionBarItem
                    icon={FavoritesIcon}
                    onClick={handleSave}
                    value={video?.views_count || "save"}
                    isActive={Saved}
                    activeClass="saved"
                />
            </div>
            <div className={cx("ActionBar__blockRight")}>
                <ShareButton icon={EmbedIcon} />
                <ShareButton icon={LetterIcon} />
                <ShareButton icon={FacebookIcon} />
                <ShareButton icon={ShareIcon} />
            </div>
        </div>
    );
}

export default ActionBar;
