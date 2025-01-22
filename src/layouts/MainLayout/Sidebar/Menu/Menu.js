import React, { memo } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./Menu.module.scss";
import { useSidebar } from "../../Context";

const cx = classNames.bind(styles);

function Menu({ children ,className}) {

    const { isSmall } = useSidebar();


    return (
        <nav className={cx("wrapper",{
            [className] : className,
            'wrapper-menuList--small': isSmall
        })}>
            <ul className={cx("menu-list")}>
                {children}
            </ul>
        </nav>
    );
}

Menu.propTypes = {
    children: PropTypes.node.isRequired,
};

export default memo(Menu);