import classNames from "classnames/bind";
import styles from "./DrawerSidebar.module.scss";

const cx = classNames.bind(styles);

function DrawerSidebar({ children, onClose }) {
    return (
        <div className={cx('DrawerSidebar-container')}>
            <div className={cx('DrawerSidebar-overlay')} onClick={onClose}></div>
            <section className={cx('DrawerSidebar-content')}>
                {children}
            </section>
        </div>
    );
}

export default DrawerSidebar;