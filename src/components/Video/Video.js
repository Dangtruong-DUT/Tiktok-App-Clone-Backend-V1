import ContentLoader, { Facebook } from 'react-content-loader'
import PropTypes from "prop-types";
import { memo, useRef, useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from './Video.module.scss';

const cx = classNames.bind(styles);

function Video({ sources = [], className }) {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isInViewport, setIsInViewport] = useState(false);

    // handle auto play video
    useEffect(() => {
        const handleInteraction = () => {
            setIsMuted(false);
        };

        window.addEventListener("click", handleInteraction);
        window.addEventListener("keydown", handleInteraction);

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

        // Xử lý khi tab không active
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (videoRef.current) {
                    videoRef.current?.pause();
                }
            } else {
                // Khi tab được kích hoạt lại, kiểm tra xem video có trong viewport không để phát lại
                if (isInViewport && videoRef.current) {
                    videoRef.current?.play().catch((error) => {
                        console.error("Error attempting to play video:", error);
                    });
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, [isInViewport]);

    if (!Array.isArray(sources)) {
        sources = [sources];
    }

    return (
        <article className={cx('video-frame', {
            [className]: className
        })}>
            <div className={cx('videoControls-top')}>
            </div>
            <video
                className={cx('video-frame__video')}
                ref={videoRef}
                playsInline
                loop
                muted={isMuted}
                controls
            >
                {sources.map((source, index) => (
                    <source key={index} src={source.data} type={source.type} />
                ))}
                Your browser does not support the video tag.
            </video>
            <div className={cx('videoControls-bottom')}>
            </div>
        </article>
    );
}

Video.propTypes = {
    sources: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.arrayOf(PropTypes.object)
    ]).isRequired,
};

export default memo(Video);
