import React from "react";
import classNames from "classnames/bind";
import styles from "./ProfileAuthor.module.scss";
import Avatar from "@/components/Avatar";
import Button from "@/components/button";
import { TextWithTags } from "@/components/TextWithTags";


const cx = classNames.bind(styles);

function ProfileAuthor({ following, handleFollow }) {

    return (
        <div className={cx("profileAuthor")}>
            <div className={cx("profileAuthor__row")}>
                <div className={cx("profileAuthor__contact")} >
                    <a href="user">
                        <Avatar dataSize="40px" image="https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/99ce6717220f27b7304707986da6c960.jpeg?lk3s=a5d48078&nonce=86983&refresh_token=ea8973fec629163ec7df64b7b05e6680&x-expires=1737820800&x-signature=yjExZp%2Bz61yBFE7NcUF9vINKd1c%3D&shp=a5d48078&shcp=81f88b70" />
                    </a>
                    <a href="user" className={cx("profileAuthor__info")}>
                        <h2 className={cx("profileAuthor__info__name")}>thanhthe2712</h2>
                        <p className={cx("profileAuthor-info__row")}>
                            <span >DancewithLexie</span>
                            <span className={cx('dotSeparate')}>·</span>
                            <span >10m ago</span>
                        </p>
                    </a>
                </div>
                <Button
                    className={cx("profileAuthor__btn-follow")}
                    primary={true}
                    onClick={handleFollow}
                >
                    {following ? "Unfollow" : "Follow"}
                </Button>
            </div>
            <h1 className={cx("profileAuthor__desc")}>
                <TextWithTags text="
                 về lại lê quý đônn hội xuânnnnnn, btw bữa ai bảo thic bài nàyyyyy dc
                @Nao viral thì
                đổi tên 🇻🇳 #fyp #xuhuong"
                />
            </h1>
        </div>
    );
}


export default ProfileAuthor;