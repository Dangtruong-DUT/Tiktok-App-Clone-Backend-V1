import { memo, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from './VolumeBar.module.scss';
import { VideoSoundIcon } from "@/components/Icons";

const cx = classNames.bind(styles);

function VolumeBar({ className, volume, onVolumeChange, isMuted, onMuteToggle }) {
    const volumeRef = useRef(null);

    const handleVolumeChange = (event) => {
        const rect = volumeRef.current.getBoundingClientRect();
        const newVolume = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
        onVolumeChange(newVolume);
    };

    const handleMouseMove = (event) => {
        if (event.buttons === 1) {
            handleVolumeChange(event);
        }
    };

    const handleMuteClick = () => { 
        onMuteToggle(!isMuted);
    };

    return (
        <div className={cx('volume-control', {
            [className]: className
        })}>
            <div className={cx('volume-control__icon', {
                visible: isMuted||volume===0
            })} onClick={handleMuteClick}>
                <VideoSoundIcon width="100%" height="100%" isMuted={isMuted||(volume===0)} />
            </div>
            <div
                className={cx('volumeBar-container')}
                ref={volumeRef}
                onMouseDown={handleVolumeChange}
                onMouseMove={handleMouseMove}
            >
                <div className={cx('volume-bar')}>
                    <div
                        className={cx('volume-bar__track')}
                        style={{ width: `${volume * 100}%` }}
                    />
                    <div className={cx('volume-bar__thumb')} style={{ left: `${volume * 100}%` }} />
                </div>
            </div>
        </div>
    );
}


VolumeBar.propTypes = {
    volume: PropTypes.number.isRequired,
    onVolumeChange: PropTypes.func.isRequired,
};

export default memo(VolumeBar);