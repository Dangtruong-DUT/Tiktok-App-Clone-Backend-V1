import React from "react";
import Tippy from '@tippyjs/react/headless';
import styles from "./ActionBar.module.scss";
import classNames from "classnames/bind";
import {
    CommentIcon,
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
                iconSize="0.5em"
                className={cx('transitionBGC')}
            />
            <strong className={cx("actionBar-item__value")}>{value}</strong>
        </div>
    );
}

function ShareButton({ icon: Icon, iconSize = '24', title }) {


    return (
        <Tippy
            placement='top'
            animation='fade'
            render={()=> {
                return(
                    <span className="">
                        {title}
                    </span>

                )
            }}
        >
            <button type="button" className={cx("shareIcon")}>
                <Icon width={iconSize} height={iconSize} />
            </button>
        </Tippy>
    );
}
function ActionBar({ Liked, Saved, handleLike, handleSave, video }) {
    return (
        <div className={cx("ActionBar")}>
            <div className={cx('ActionBar-main')}>
                <div className={cx("ActionBar__groupReact")}>
                    <ActionBarItem
                        icon={LikeIcon}
                        onClick={handleLike}
                        value={video?.likes_count || "likes"}
                        isActive={Liked}
                        activeClass={cx('like')}
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
                        activeClass={cx('save')}
                    />
                </div>
                <div className={cx("ActionBar__GroupShare")}>
                    <ShareButton icon={LetterIcon} title='Send to friends' />
                    <ShareButton icon={FacebookIcon} title='Share to Facebook' />
                    <ShareButton icon={ShareIcon} />
                </div>
            </div>
            <div className={cx('ActionBar-CopyLink')}>
                <p className={cx('ActionBar-CopyLink__link')}>
                    https://www.tiktok.com/@sau.drama/video/74630654444444444444444444
                </p>
                <button className={cx('ActionBar-CopyLink__btn')}>
                    Copy link
                </button>
            </div>
        </div>
    );
}

export default ActionBar;
