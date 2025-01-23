import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './RenderTextWithTag.module.scss';

const cx = classNames.bind(styles);

function TextWithTags({ text }) {
    const renderContent = (text) => {
        const words = text.split(' ');
        return words.map((word, index) => {
            if (word.startsWith('@')) {
                return (
                    <a
                        key={index}
                        href={`/user/${word.substring(1)}`}
                        className={cx('text-with-tags__tag')}
                    >
                        {word}
                    </a>
                );
            } else if (word.startsWith('#')) {
                return (
                    <a
                        key={index}
                        href={`/hashtag/${word.substring(1)}`}
                        className={cx('text-with-tags__hashtag')}
                    >
                        {word}
                    </a>
                );
            }
            return <span key={index} className={cx('text-with-tags__normal')}> {word} </span>;
        });
    };

    return <div>{renderContent(text)}</div>;
};

TextWithTags.propTypes = {
    text: PropTypes.string.isRequired,
};

export default TextWithTags;
