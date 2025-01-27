import { memo, useRef, useEffect, useState } from 'react';
import styles from './TabBar.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function TabBar({ tabs, activeTab, onTabChange }) {
    const underlineRef = useRef();

    const updateUnderline = (element) => {
        if (element && underlineRef.current) {
            underlineRef.current.style.width = `${element.offsetWidth}px`;
            underlineRef.current.style.left = `${element.offsetLeft}px`;
        }
    };

    useEffect(() => {
        const activeTabElement = document.querySelector(`.${styles.tabFeed}.${styles.active}`);
        updateUnderline(activeTabElement);
    }, [activeTab, tabs]);

    const handleMouseEnter = (tab) => {
        const hoveredTabElement = document.querySelector(
            `.${styles.tabFeed}[data-key="${tab.heading}"]`
        );
        updateUnderline(hoveredTabElement);
    };

    const handleMouseLeave = () => {
        const activeTabElement = document.querySelector(`.${styles.tabFeed}.${styles.active}`);
        updateUnderline(activeTabElement);
    };

    return (
        <div className={cx('wrapper')}>
            <ul className={cx('tabBar')}>
                {tabs.map((tab) => (
                    <li
                        key={tab.heading}
                        data-key={tab.heading}
                        className={cx('tabFeed', { active: tab.heading === activeTab })}
                        onClick={() => onTabChange(tab.heading)}
                        onMouseEnter={() => handleMouseEnter(tab)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <span className={cx('tabBar_icon')}>{tab.icon}</span>
                        <span>{tab.heading}</span>
                    </li>
                ))}
                <div ref={underlineRef} className={cx('underline')}></div>
            </ul>
        </div>
    );
}

export default memo(TabBar);
