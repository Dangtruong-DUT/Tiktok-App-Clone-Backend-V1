import classNames from "classnames/bind";
import styles from './Avatar.module.scss';

const cx = classNames.bind(styles);

function Avatar({ image, altValue = "", dataSize = "32px" }) {
    return (
        <div
            className={cx('wrapper')}
            style={{ '--size': dataSize }}
        >
            <img className={cx('image')} src={image} alt={altValue} />
        </div>
    );
}

export default Avatar;