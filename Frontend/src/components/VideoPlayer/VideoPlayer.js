import PropTypes from "prop-types";
import { memo, useRef, useEffect, useState, useCallback } from "react";
import classNames from "classnames/bind";
import styles from './Video.module.scss';
import { ProgressBar } from "./ProgressBar";
import { DynamicVolumeIcon, PauseIcon, PlayIcon } from "../Icons";
import VolumeBar from "./VolumeBar/VolumeBar";
import { VideoDescription } from "./Description";
import { TimeAgo } from "../TimeAgo";

const cx = classNames.bind(styles);

function VideoPlayer({ sources = [], className }) {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [isInViewport, setIsInViewport] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(false);
    const [showMutedIcon, setShowMutedIcon] = useState(false);
    const [isProgressBarActive, setIsProgressBarActive] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInViewport(true);
                    if (videoRef.current) {
                        videoRef.current.play().catch((error) => {
                            console.error("Error attempting to play video:", error);
                        });
                    }
                } else {
                    setIsInViewport(false);
                    if (videoRef.current) {
                        videoRef.current.pause();
                    }
                }
            },
            {
                threshold: 0.5,
            }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (videoRef.current) {
                    videoRef.current.pause();
                }
            } else {
                if (isInViewport && videoRef.current) {
                    videoRef.current.play().catch((error) => {
                        console.error("Error attempting to play video:", error);
                    });
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, [isInViewport]);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const video = videoRef.current;

        const updateTime = () => {
            setCurrentTime(video.currentTime);
        };

        const updateDuration = () => {
            setDuration(video.duration);
        };

        video.addEventListener("timeupdate", updateTime);
        video.addEventListener("loadedmetadata", updateDuration);

        return () => {
            video.removeEventListener("timeupdate", updateTime);
            video.removeEventListener("loadedmetadata", updateDuration);
        };
    }, []);

    const handlePlayPause = (event) => {

        if (event.target !== videoRef.current) {
            return;
        }
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play().catch((error) => {
                    console.error("Error attempting to play video:", error);
                });
            } else {
                videoRef.current.pause();
            }
            setIsPlaying(!isPlaying);
            setShowPlayPauseIcon(true);
            setTimeout(() => {
                setShowPlayPauseIcon(false);
            }, 500);
        }
    };

    const handleSeek = useCallback((time) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, []);


    const handleMuteToggle = useCallback((newMutedState) => {
        setIsMuted(newMutedState);
        setShowMutedIcon(true);
        if (videoRef.current) {
            videoRef.current.muted = newMutedState;
        }
        setTimeout(() => {
            setShowMutedIcon(false);
        }, 500);
    }, []);

    const handleVolumeChange = useCallback((newVolume) => {
        setVolume(newVolume);
        if (newVolume === 0) {
            setIsMuted(true);
            setShowMutedIcon(true);
            setTimeout(() => {
                setShowMutedIcon(false);
            }, 500);
        } else {
            setIsMuted(false);
        }
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    }, []);

    const handleProgressBarActive = useCallback((active) => {
        setIsProgressBarActive(active);
    }, []);

    if (!Array.isArray(sources)) {
        sources = [sources];
    }

    return (
        <div className={cx('wrapper', {
            [className]: className
        })}>
        <section
            className={cx('video-frame')}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={cx('videoControls-top')}>
                <VolumeBar
                    className={cx('icons')}
                    volume={volume}
                    onVolumeChange={handleVolumeChange}
                    isMuted={isMuted}
                    onMuteToggle={handleMuteToggle}
                    isParentHovered={isHovered}
                />
            </div>
            {showPlayPauseIcon && (
                <div className={cx('overlay-icon')}>
                    {!isPlaying ?
                        <PauseIcon width="1em" height="1em" />
                        :
                        <PlayIcon width="1em" height="1em" />
                    }
                </div>
            )}
            {showMutedIcon &&
                <div className={cx('overlay-icon')}>
                    <DynamicVolumeIcon width="1em" height="1em" isMuted={isMuted} />
                </div>
            }
            <video
                onClick={handlePlayPause}
                className={cx('video-frame__video')}
                ref={videoRef}
                playsInline
                loop
                muted={isMuted}
            >
                {sources.map((source, index) => (
                    <source key={index} src={source.file_url} type={source.type} />
                ))}
                Your browser does not support the video tag.
            </video>
            <div className={cx('videoControls-bottom')}
                onClick={handlePlayPause}
            >
                <div className={cx('video-multiText', {
                    hidden: isProgressBarActive
                })}>
                    <a href={`@${sources[0].author}`} className={cx('video-author-container')}>
                        <h3 className={cx('video-author')}>{sources[0].user.nickname}</h3>
                        <TimeAgo timestamp={sources[0].created_at} />
                    </a>
                    <VideoDescription description={sources[0].description} />
                </div>
                <ProgressBar
                    className={cx('progress')}
                    currentTime={currentTime}
                    duration={duration}
                    onSeek={handleSeek}
                    onActive={handleProgressBarActive}
                />
            </div>
        </section>
        </div>
    );
}

VideoPlayer.propTypes = {
    sources: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]).isRequired,
};

export default memo(VideoPlayer);
