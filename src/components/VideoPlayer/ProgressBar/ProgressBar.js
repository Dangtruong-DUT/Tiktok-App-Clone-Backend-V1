import { memo, useRef, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from './ProgressBar.module.scss';

const cx = classNames.bind(styles);

const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};

function ProgressBar({ currentTime, duration, className, onActive, onSeek }) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragTime, setDragTime] = useState(currentTime);
    const progressBarRef = useRef(null);

    const calculateTimeFromEvent = (e) => {
        const slider = progressBarRef.current;
        if (!slider) return currentTime;

        const rect = slider.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
        return (offsetX / rect.width) * duration;
    };

    const handleStart = (e) => {
        e.preventDefault();
        setIsDragging(true);
        const newTime = calculateTimeFromEvent(e);
        setDragTime(newTime);
        onSeek(newTime);
        onActive(true);
    };

    const handleMove = (e) => {
        if (!isDragging) return;
        const newTime = calculateTimeFromEvent(e);
        setDragTime(newTime);
        onSeek(newTime);
    };

    const handleEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        onActive(false);
    };

    const handleTrackClick = (e) => {
        const newTime = calculateTimeFromEvent(e);
        onSeek(newTime);
    };

    const progressPercentage = isDragging
        ? (dragTime / duration) * 100
        : (currentTime / duration) * 100;

    return (
        <div
            className={cx('progress', className)}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
        >
            <div
                className={cx('progress__thumb', { dragging: isDragging })}
                style={{ left: `${progressPercentage}%` }}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
            />
            <div className={cx('progress__time')}>
                {formatTime(isDragging ? dragTime : currentTime)} / {formatTime(duration)}
            </div>
            <div className={cx('progressBar-container')}>
                <div
                    ref={progressBarRef}
                    className={cx('progress-bar')}
                    onMouseDown={handleTrackClick}
                    onTouchStart={handleTrackClick}
                >
                    <div
                        className={cx('progress-bar__track')}
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

ProgressBar.propTypes = {
    currentTime: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    onSeek: PropTypes.func.isRequired,
    onActive: PropTypes.func.isRequired,
};

export default memo(ProgressBar);
