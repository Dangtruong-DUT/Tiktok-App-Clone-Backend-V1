import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Menu.module.scss";

const cx = classNames.bind(styles);

function MenuItem({ title, to, Icon }) {
    return (
        <li>
            <NavLink
                to={to}
                className={(nav) =>
                    cx("menu-item", {
                        active: nav.isActive,
                    })
                }
            >
                {({ isActive }) => (
                    <>
                        <Icon
                            className={cx("menu-item__icon", {
                                active: isActive,
                            })}
                            bold={isActive}
                        />
                        <span className={cx("menu-item__title")}>{title}</span>
                    </>
                )}
            </NavLink>
        </li>
    );
}

MenuItem.propTypes = {
    to: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    Icon: PropTypes.elementType.isRequired,
};

export default MenuItem;
