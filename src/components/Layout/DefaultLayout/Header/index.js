import classNames from "classnames/bind";
import styles from "./Header.module.scss"

const cx = classNames.bind(styles);

function Header() {
    return (
        <header className={cx("wrapper")}>
            <div className={cx("content")}>
                <div className="logo">
                    <a href="#!"><svg xmlns="http://www.w3.org/2000/svg" width="118" height="42" fill="currentColor" alt="TikTok"></svg></a>
                </div>
            </div>
        </header>
    );
}

export default Header;