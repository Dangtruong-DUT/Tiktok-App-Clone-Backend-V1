import React from "react";
import classNames from "classnames/bind";
import styles from "./ActionButton.module.scss";

const cx = classNames.bind(styles);

function ActionButton({ icon: Icon, onClick, isActive, activeClass, className, iconSize = "1em" }) {
    return (
        <button
            type="button"
            className={cx("icon-button", className, { [activeClass]: isActive })}
            onClick={onClick}
        >
            <Icon width={iconSize} height={iconSize} />
        </button>
    );
}

export default ActionButton;



