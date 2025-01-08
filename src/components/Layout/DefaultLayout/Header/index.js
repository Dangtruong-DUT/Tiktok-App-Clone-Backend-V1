import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import classNames from "classnames/bind";

import styles from "./Header.module.scss"
import { Link } from "react-router-dom";
import images from "@/assets/images";
import { PopperWrapper } from '@/components/Popper';
import Avatar from '@/components/Avatar';
import AccountItem from '@/components/AccountItem';

const cx = classNames.bind(styles);

function Header() {
    const [searchResults, setSearchResults] = useState([]);
    useEffect(() => {
        setTimeout(() => {
            setSearchResults([
                { username: 'nd.trg281', nameAccounted: 'Tập làm IT', avatar: 'https://p9-sign-sg.tiktokcdn.com/aweme/1080x1080/tos-alisg-avt-0068/336f384d3b734435f031ecf4b0c4ebdc.jpeg?lk3s=a5d48078&nonce=89008&refresh_token=d7feae455d146ec97573b44b681e5a7e&x-expires=1736503200&x-signature=2zt5%2B18msRTPN3xw7uL3%2Beicy%2Fc%3D&shp=a5d48078&shcp=81f88b70', verified: false },
                { username: 'hades.studio', nameAccounted: 'HADES STUDIO', avatar: 'https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/06a69b8d6d75b1d0ef5f48ada128c505~c5_1080x1080.jpeg?lk3s=a5d48078&nonce=24854&refresh_token=4d810f952f370f03483ebb2d2bd36ef5&x-expires=1736503200&x-signature=omIKAancgwJLKdACNzyYCETvNAk%3D&shp=a5d48078&shcp=81f88b70', verified: false },
                { username: 'hada.kr', nameAccounted: 'HADA', avatar: 'https://p16-sign-sg.tiktokcdn.com/aweme/1080x1080/tos-alisg-avt-0068/ef5e7047d64c4f0991f994dabd9ff4f9.jpeg?lk3s=a5d48078&nonce=18909&refresh_token=4e789f231063d62372951b9d6a95c294&x-expires=1736503200&x-signature=UpGaEMf0tFoz0r2KUu%2FZSlVboOw%3D&shp=a5d48078&shcp=81f88b70', verified: true },
            ]);
        }, 0);
    });

    return (
        <header className={cx("wrapper")}>
            <div className={cx("content")}>
                <div className="logo">
                    <Link className={cx('logo__link')} to="/">
                        <svg xmlns="http://www.w3.org/2000/svg" width="118" height="42" fill="currentColor" alt="TikTok">
                            <path fill="#25F4EE" d="M9.875 16.842v-1.119A9 9 0 0 0 8.7 15.64c-4.797-.006-8.7 3.9-8.7 8.708a8.7 8.7 0 0 0 3.718 7.134A8.68 8.68 0 0 1 1.38 25.55c0-4.737 3.794-8.598 8.495-8.707"></path>
                            <path fill="#25F4EE" d="M10.086 29.526c2.14 0 3.89-1.707 3.967-3.83l.006-18.968h3.463a7 7 0 0 1-.11-1.202h-4.726l-.006 18.969a3.98 3.98 0 0 1-3.967 3.829 3.9 3.9 0 0 1-1.846-.46 3.95 3.95 0 0 0 3.22 1.662m13.905-16.36v-1.055a6.5 6.5 0 0 1-3.583-1.068 6.57 6.57 0 0 0 3.583 2.123"></path>
                            <path fill="#FE2C55" d="M20.409 11.044a6.54 6.54 0 0 1-1.616-4.316h-1.265a6.56 6.56 0 0 0 2.88 4.316M8.706 20.365a3.98 3.98 0 0 0-3.973 3.976c0 1.528.869 2.858 2.134 3.523a3.94 3.94 0 0 1-.754-2.321 3.98 3.98 0 0 1 3.973-3.976c.409 0 .805.07 1.175.185v-4.833a9 9 0 0 0-1.175-.083c-.07 0-.134.006-.204.006v3.708a4 4 0 0 0-1.176-.185"></path>
                            <path fill="#FE2C55" d="M23.992 13.166v3.676c-2.453 0-4.727-.786-6.58-2.116v9.622c0 4.8-3.902 8.713-8.706 8.713a8.67 8.67 0 0 1-4.988-1.579 8.7 8.7 0 0 0 6.368 2.781c4.797 0 8.707-3.906 8.707-8.714v-9.621a11.25 11.25 0 0 0 6.579 2.116v-4.73q-.72-.002-1.38-.148"></path>
                            <path fill="black" d="M17.413 24.348v-9.622a11.25 11.25 0 0 0 6.58 2.116v-3.676a6.57 6.57 0 0 1-3.584-2.123 6.6 6.6 0 0 1-2.888-4.315H14.06l-.006 18.968a3.98 3.98 0 0 1-3.967 3.83A3.99 3.99 0 0 1 6.86 27.87a3.99 3.99 0 0 1-2.133-3.523A3.98 3.98 0 0 1 8.7 20.372c.409 0 .805.07 1.175.185v-3.708c-4.701.103-8.495 3.964-8.495 8.701 0 2.29.888 4.373 2.338 5.933a8.67 8.67 0 0 0 4.988 1.58c4.798 0 8.707-3.913 8.707-8.714m12.635-11.17h14.775l-1.355 4.232h-3.832v15.644h-4.778V17.41l-4.804.006zm38.984 0h15.12l-1.355 4.232h-4.17v15.644h-4.785V17.41l-4.804.006zM45.73 19.502h4.733v13.553h-4.708zm6.617-6.374h4.733v9.257l4.689-4.61h5.646l-5.934 5.76 6.644 9.52h-5.213l-4.433-6.598-1.405 1.362v5.236H52.34V13.128zm50.143 0h4.734v9.257l4.688-4.61h5.647l-5.934 5.76 6.643 9.52h-5.206l-4.433-6.598-1.405 1.362v5.236h-4.734zm-54.397 4.826a2.384 2.384 0 0 0 2.382-2.384 2.384 2.384 0 1 0-2.382 2.384"></path>
                            <path fill="#25F4EE" d="M83.545 24.942a8.11 8.11 0 0 1 7.473-8.087 9 9 0 0 0-.709-.026c-4.478 0-8.106 3.631-8.106 8.113s3.628 8.113 8.106 8.113c.21 0 .498-.013.71-.026-4.178-.326-7.475-3.823-7.475-8.087"></path>
                            <path fill="#FE2C55" d="M92.858 16.83c-.217 0-.505.012-.716.025a8.11 8.11 0 0 1 7.468 8.087 8.11 8.11 0 0 1-7.468 8.087c.211.02.499.026.716.026 4.478 0 8.106-3.631 8.106-8.113s-3.628-8.113-8.106-8.113"></path>
                            <path fill="black" d="M91.58 28.887a3.94 3.94 0 0 1-3.94-3.945 3.94 3.94 0 1 1 7.882 0c0 2.18-1.77 3.945-3.942 3.945m0-12.058c-4.477 0-8.106 3.631-8.106 8.113s3.629 8.113 8.106 8.113 8.106-3.631 8.106-8.113-3.628-8.113-8.106-8.113"></path>
                        </svg>
                    </Link>
                </div>
                <Tippy
                    visible={searchResults.length > 0}
                    interactive={true}
                    appendTo={document.body}
                    render={(attr) => {
                        return (
                            <div className={cx('search-results')}>
                                <PopperWrapper >
                                    <h4 className={cx('search-title')}>Account</h4>
                                    <ul tabIndex={-1}>
                                        {searchResults.map((result, index) =>
                                            <AccountItem
                                                key={index}
                                                avatarSize='40px'
                                                avatar={result.avatar}
                                                username={result.username}
                                                nameAccount={result.nameAccounted}
                                            />
                                        )}
                                    </ul>
                                </PopperWrapper>
                            </div>
                        )
                    }}
                >
                    <form className={cx('search-wrapper')}>

                        <div className={cx('search')}>

                            <input className={cx('search__input')} type="text" placeholder="Search" spellCheck='false' />


                            <div className={cx('search__icon-clear')} >

                                <svg width="16" data-e2e="" height="16" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0px 12px' }}>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M24 46C36.1503 46 46 36.1503 46 24C46 11.8497 36.1503 2 24 2C11.8497 2 2 11.8497 2 24C2 36.1503 11.8497 46 24 46ZM15.1466 30.7323L21.8788 24.0001L15.1466 17.2679C14.756 16.8774 14.756 16.2442 15.1466 15.8537L15.8537 15.1466C16.2442 14.756 16.8774 14.756 17.2679 15.1466L24.0001 21.8788L30.7323 15.1466C31.1229 14.756 31.756 14.756 32.1466 15.1466L32.8537 15.8537C33.2442 16.2442 33.2442 16.8774 32.8537 17.2679L26.1214 24.0001L32.8537 30.7323C33.2442 31.1229 33.2442 31.756 32.8537 32.1466L32.1466 32.8537C31.756 33.2442 31.1229 33.2442 30.7323 32.8537L24.0001 26.1214L17.2679 32.8537C16.8774 33.2442 16.2442 33.2442 15.8537 32.8537L15.1466 32.1466C14.756 31.756 14.756 31.1229 15.1466 30.7323Z">
                                    </path>
                                </svg>

                            </div>
                            <div className={cx('search__icon-spinner')}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 48 48">
                                    <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" /><path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" /></path></svg></div>
                            <span className={cx('search__separate')} ></span>
                            <button className={cx('search__btn-submit')} type='submit'>
                                <svg width="24" data-e2e="" height="24" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M22 10C15.3726 10 10 15.3726 10 22C10 28.6274 15.3726 34 22 34C28.6274 34 34 28.6274 34 22C34 15.3726 28.6274 10 22 10ZM6 22C6 13.1634 13.1634 6 22 6C30.8366 6 38 13.1634 38 22C38 25.6974 36.7458 29.1019 34.6397 31.8113L43.3809 40.5565C43.7712 40.947 43.7712 41.5801 43.3807 41.9705L41.9665 43.3847C41.5759 43.7753 40.9426 43.7752 40.5521 43.3846L31.8113 34.6397C29.1019 36.7458 25.6974 38 22 38C13.1634 38 6 30.8366 6 22Z">
                                    </path>
                                </svg>
                            </button>
                        </div>
                    </form>
                </Tippy>

                <div className={cx('actions')}>
                    <Link to="/upload" className={cx('actions__upload')} >
                        <svg className="css-qeydvm-StyledPlusIcon e1on1cg35" width="1em" data-e2e="" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M8 2.5C7.58579 2.5 7.25 2.83579 7.25 3.25V7.25H3.25C2.83579 7.25 2.5 7.58579 2.5 8C2.5 8.41421 2.83579 8.75 3.25 8.75H7.25V12.75C7.25 13.1642 7.58579 13.5 8 13.5C8.41421 13.5 8.75 13.1642 8.75 12.75V8.75H12.75C13.1642 8.75 13.5 8.41421 13.5 8C13.5 7.58579 13.1642 7.25 12.75 7.25H8.75V3.25C8.75 2.83579 8.41421 2.5 8 2.5Z"></path></svg>
                        <span>Upload</span>
                    </Link>
                    <Link to="/inbox" className={cx(['actions__inbox', 'tooltip'])} data-tooltip='inbox'>
                        <svg className="css-1g0p6jv-StyledInboxIcon e1xroc441" width="32" data-e2e="" height="32" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24.0362 21.3333H18.5243L15.9983 24.4208L13.4721 21.3333H7.96047L7.99557 8H24.0009L24.0362 21.3333ZM24.3705 23.3333H19.4721L17.2883 26.0026C16.6215 26.8176 15.3753 26.8176 14.7084 26.0026L12.5243 23.3333H7.62626C6.70407 23.3333 5.95717 22.5845 5.9596 21.6623L5.99646 7.66228C5.99887 6.74352 6.74435 6 7.66312 6H24.3333C25.2521 6 25.9975 6.7435 26 7.66224L26.0371 21.6622C26.0396 22.5844 25.2927 23.3333 24.3705 23.3333ZM12.6647 14C12.2965 14 11.998 14.2985 11.998 14.6667V15.3333C11.998 15.7015 12.2965 16 12.6647 16H19.3313C19.6995 16 19.998 15.7015 19.998 15.3333V14.6667C19.998 14.2985 19.6995 14 19.3313 14H12.6647Z"></path></svg>
                    </Link>
                    <Avatar dataSize='32px' image={images.avatar} altValue='User' />
                </div>
            </div >
        </header >
    );
}

export default Header;