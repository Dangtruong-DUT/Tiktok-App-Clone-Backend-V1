import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./DrawerSidebarHeader.module.scss";
import { CrossIcon } from "@/components/Icons";

const  cx = classNames.bind(styles);

function Header({title, onExit}) {
    return (
        <header className={cx('DrawerSidebar__header')}>
            <h2 className={cx('DrawerSidebar__header-title')}>{title}</h2>
            <button className={cx('DrawerSidebar__btn')} onClick={onExit}>
                <CrossIcon width="16px" height="16px" className={cx('DrawerSidebar__icon')} />
            </button>
        </header>
    );
}

export default Header;