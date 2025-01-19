import React, { useState, useEffect, useRef, memo } from 'react';
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from './VideoDescription.module.scss';

const cx = classNames.bind(styles);


function VideoDescription({ description }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTextLong, setIsTextLong] = useState(false);
    const textRef = useRef(null);

    useEffect(() => {
        const checkTextLength = () => {
            if (textRef.current) {
                setIsTextLong(textRef.current.scrollHeight > textRef.current.clientHeight);
            }
        };

        checkTextLength();
        window.addEventListener('resize', checkTextLength);

        return () => {
            window.removeEventListener('resize', checkTextLength);
        };
    }, [description]);

    const toggleText = () => {
        setIsExpanded(prevState => !prevState);
    };

    return (
        <>
            <h1 className={cx('video-desc', {
                expanded: isExpanded
            })}
                ref={textRef}
            >
                {description}
            </h1>

            {isTextLong && (
                <button onClick={toggleText} className={cx('more-less-btn')}>
                    {isExpanded ? 'Less' : 'More'}
                </button>
            )}
        </>
    );
}

VideoDescription.propTypes = {
    description: PropTypes.string.isRequired,
};

export default memo(VideoDescription);
