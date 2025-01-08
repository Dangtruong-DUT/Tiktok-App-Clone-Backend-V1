import classNames from "classnames/bind";
import styles from './Avatar.module.scss';

const cx = classNames.bind(styles);

function Avatar({ image, className, altValue = "", dataSize = "32px" }) {
    const classNames = cx('wrapper', {
        [className]: className
    })

    return (
        <div
            className={classNames}
            style={{ '--size': dataSize }}
        >
            <img className={cx('image')} src={image} alt={altValue} />
        </div>
    );
}

export default Avatar;