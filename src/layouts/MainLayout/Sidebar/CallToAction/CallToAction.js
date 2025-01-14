import classNames from "classnames/bind";
import Button from "@/components/button";
import styles from './CallToAction.module.scss';

const cx = classNames.bind(styles);
function CallToAction() {
    return (
        <div className={cx('wrapper')}>
            <p className={cx('cta-desc')}>
                Log in to follow creators, like videos, and view comments.
            </p>
            <Button className={cx('cta-btn')} outline={true}>Login</Button>
        </div>
    );
}

export default CallToAction;