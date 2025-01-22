import React from "react";
import classNames from "classnames/bind";
import Styles from './SidebarHeader.module.scss';
import { LogoBrand, SearchIcon } from "@/components/Icons";
import config from "@/config";
import { Link } from "react-router-dom";
import { useSidebar } from "../../Context";

const cx = classNames.bind(Styles);

function SidebarHeader({onToggleSearchBar}) {
    const { isSmall } = useSidebar();
    return (
        <header className={cx('sidebar-header', {
            'sidebar-header--small': isSmall
        })}>
            <Link className={cx('sidebar-header__logo')} to={config.home}>
                <LogoBrand
                    small= {isSmall}
                />
            </Link>
            <button className={cx('sidebar-header__search')} onClick={onToggleSearchBar}>
                <div className={cx('sidebar-search')}>
                    <div className={cx('sidebar-search__icon')}>
                        <SearchIcon width="1.9rem" height="1.9rem" />
                    </div>
                    <div className={cx('sidebar-search__label')}>Search</div>
                </div>
            </button>
        </header>
    );
}

export default SidebarHeader;
