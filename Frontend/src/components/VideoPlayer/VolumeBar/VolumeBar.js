import { memo, useRef, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from './VolumeBar.module.scss';
import { VideoSoundIcon } from "@/components/Icons";

const cx = classNames.bind(styles);

function VolumeBar({ className, volume, onVolumeChange, isParentHovered = true , isMuted, onMuteToggle }) {
    const volumeRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragVolume, setDragVolume] = useState(volume);

    const calculateVolumeFromEvent = (event) => {
        const rect = volumeRef.current.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
        return offsetX / rect.width;
    };

    const handleStart = (event) => {
        event.preventDefault();
        setIsDragging(true);
        const newVolume = calculateVolumeFromEvent(event);
        setDragVolume(newVolume);
        onVolumeChange(newVolume);
    };

    const handleMove = (event) => {
        if (!isDragging) return;
        const newVolume = calculateVolumeFromEvent(event);
        setDragVolume(newVolume);
        onVolumeChange(newVolume);
    };

    const handleEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
    };

    const handleMuteClick = () => {
        onMuteToggle(!isMuted);
    };

    const volumePercentage = isDragging ? dragVolume * 100 : volume * 100;

    return (
        <div
            className={cx('volume-control', {
                [className]: className,
                hovered: isParentHovered
            }
            )}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
        >
            <div
                className={cx('volume-control__icon', { visible: isMuted || volume === 0 })}
                onClick={handleMuteClick}
            >
                <VideoSoundIcon width="100%" height="100%" isMuted={isMuted || volume === 0} />
            </div>
            <div
                className={cx('volumeBar-container')}
                ref={volumeRef}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
            >
                <div className={cx('volume-bar')}>
                    <div
                        className={cx('volume-bar__track')}
                        style={{ width: `${volumePercentage}%` }}
                    />
                    <div
                        className={cx('volume-bar__thumb', { dragging: isDragging })}
                        style={{ left: `${volumePercentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

VolumeBar.propTypes = {
    volume: PropTypes.number.isRequired,
    onVolumeChange: PropTypes.func.isRequired,
    isMuted: PropTypes.bool.isRequired,
    onMuteToggle: PropTypes.func.isRequired,
    isParentHovered: PropTypes.bool,
};

export default memo(VolumeBar);
