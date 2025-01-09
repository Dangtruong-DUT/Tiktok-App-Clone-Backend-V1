import classNames from "classnames/bind";
import styles from './Button.module.scss';
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function Button({
    to,
    href,
    children,
    primary = false,
    outline = false,
    text,
    rounded =false,
    disabled = false,
    size ,
    className,
    leftIcon,
    rightIcon,
    onClick,
    ...passProps
}) {
    let Component = 'button';
    const props = {
        onClick,
        ...passProps
    };
    // Remove all event handlers if the button is disabled
    if (disabled) {
        Object.keys(props).forEach(key => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }

    if (to) {
        Component = Link;
        props.to = to;
    } else if (href) {
        Component = 'a';
        props.href = href;
    }

    const classes = cx('wrapper', {
        [size]:size,
        primary,
        outline,
        text,
        disabled,
        rounded,
        [className]:className
    });

    return (
        <Component className={classes} {...props}>
            {leftIcon&& <span className={cx('icon')}>{leftIcon}</span>}
            <span className={cx('title')}>{children}</span>
            {rightIcon&& <span className={cx('icon')}>{rightIcon}</span>}
        </Component>
    );
}

export default Button;