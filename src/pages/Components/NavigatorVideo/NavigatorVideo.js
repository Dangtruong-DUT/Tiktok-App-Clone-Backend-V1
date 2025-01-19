import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from './NavigatorVideo.module.scss';
import { ChevronLeftIcon } from "@/components/Icons";
import { memo } from "react";

const cx = classNames.bind(styles);

function NavigatorVideo({ handleClickPrevBtn, index, handleClickNextBtn, className }) {
    return (
        <div className={cx('NavigatorVideo-wrapper', {
            [className]: className
        })}>
            <div className={cx('NavigatorVideo-content')}>
                <button
                    className={cx('NavigatorVideo__btn', { disabled: index === 0 })}
                    onClick={handleClickPrevBtn}
                >
                    <ChevronLeftIcon width="0.5em" height="0.5em" rotate="90deg" />
                </button>
                <button
                    className={cx('NavigatorVideo__btn')}
                    onClick={handleClickNextBtn}
                >
                    <ChevronLeftIcon width="0.5em" height="0.5em" rotate="270deg" />
                </button>
            </div>
        </div >
    );
}

NavigatorVideo.propTypes = {
    handleClickPrevBtn: PropTypes.func.isRequired,
    handleClickNextBtn: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
};

export default memo(NavigatorVideo);
