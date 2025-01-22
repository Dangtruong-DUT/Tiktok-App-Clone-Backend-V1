import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./Menu.module.scss";
import { Link } from "react-router-dom";
import { useSidebar } from "../../Context";

const cx = classNames.bind(styles);
function MenuItem({disabled =false, title, Icon, avatar, isActive, onClick, href, to , ...passProps }) {

    const { isSmall } = useSidebar();

    let Component = 'button';
    const props = {
        ...passProps,
    };

    if (href) {
        Component = 'a';
        props.href = href;
    } else if (to) {
        Component = Link;
        props.to = to;
    }
    // Remove all event handlers if the button is disabled
    if (disabled) {
        Object.keys(props).forEach(key => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }
    return (
        <li>
            <Component
                onClick={onClick}
                className={cx("menu-item", {
                    active: isActive,
                    'wrapper-item--small': isSmall,
                })}
                {...props}
            >
                {Icon && (
                    <Icon
                        className={cx("menu-item__icon", {
                            active: isActive,
                        })}
                        bold={isActive}
                    />
                )}
                {avatar}
                <span className={cx("menu-item__title")}>{title}</span>
            </Component>
        </li>
    );
}

MenuItem.propTypes = {
    title: PropTypes.string.isRequired,
    Icon: PropTypes.elementType,
    avatar: PropTypes.node,
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
};

export default MenuItem;

