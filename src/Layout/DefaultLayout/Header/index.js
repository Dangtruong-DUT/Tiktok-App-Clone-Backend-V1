import { Children, useEffect, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import classNames from "classnames/bind";

import styles from "./Header.module.scss"
import { Link } from "react-router-dom";
import images from "@/assets/images";
import { PopperWrapper } from '@/components/Popper';
import Avatar from '@/components/Avatar';
import AccountItem from '@/components/AccountItem';
import Button from '@/components/button';
import Menu from '@/components/Popper/components/Menu';

const cx = classNames.bind(styles);

const MENU_ITEMS = [
    {
        icon: <svg width="1em" data-e2e="" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M10.5366 1.02886C10.2252 0.768225 9.77282 0.768225 9.46141 1.02886L0.729156 8.48328C0.555867 8.63122 0.533536 8.89091 0.679026 9.06625L1.20206 9.6966C1.35794 9.88447 1.64122 9.89868 1.81513 9.72736L2.51273 9.04012L3.24979 17.1829C3.30877 17.8345 3.85276 18.3334 4.50423 18.3334H15.1103C15.979 18.3334 16.7043 17.6682 16.7829 16.7993L17.4853 9.04012L18.1849 9.72798C18.3588 9.89903 18.6419 9.88469 18.7977 9.69694L19.3209 9.06628C19.4664 8.89093 19.4441 8.63121 19.2708 8.48329L10.5366 1.02886ZM4.88767 16.6466L4.08038 7.72809L9.99899 2.77458L15.9176 7.72809L15.1103 16.6466H4.88767ZM9.37502 14.0809L13.125 11.9158C13.9584 11.4347 13.9584 10.2319 13.125 9.75078L9.37502 7.58571C8.54169 7.10459 7.50002 7.706 7.50002 8.66825V12.9984C7.50002 13.9606 8.54169 14.562 9.37502 14.0809ZM9.16669 9.38993L11.6667 10.8333L9.16669 12.2767V9.38993Z"></path>
        </svg>,
        title: 'Creator tools',
        children: {
            title: 'Creator tools',
            menuItems: [
                {
                    icon: <svg width="1em" data-e2e="" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11.6667 13.2748C11.6667 12.6798 11.9838 12.13 12.4988 11.8321C13.9977 10.965 15 9.34859 15 7.49998C15 4.73856 12.7614 2.49998 10 2.49998C7.23859 2.49998 5.00001 4.73856 5.00001 7.49998C5.00001 9.34859 6.00237 10.965 7.50122 11.8321C8.01621 12.13 8.33334 12.6798 8.33334 13.2748V14.7916C8.33334 14.9067 8.42662 15 8.54168 15H11.4583C11.5734 15 11.6667 14.9067 11.6667 14.7916V13.2748ZM13.3333 13.2748V15.8333C13.3333 16.2935 12.9602 16.6666 12.5 16.6666H7.50001C7.03977 16.6666 6.66668 16.2935 6.66668 15.8333V13.2748C4.67401 12.1221 3.33334 9.96759 3.33334 7.49998C3.33334 3.81808 6.31811 0.833313 10 0.833313C13.6819 0.833313 16.6667 3.81808 16.6667 7.49998C16.6667 9.96759 15.326 12.1221 13.3333 13.2748Z"></path><path d="M7.50001 17.9166C7.50001 17.6865 7.68656 17.5 7.91668 17.5H12.0833C12.3135 17.5 12.5 17.6865 12.5 17.9166V18.75C12.5 18.9801 12.3135 19.1666 12.0833 19.1666H7.91668C7.68656 19.1666 7.50001 18.9801 7.50001 18.75V17.9166Z"></path><path fillRule="evenodd" clipRule="evenodd" d="M8.46401 4.45524C8.67291 4.3393 8.92711 4.34959 9.12639 4.48207L12.8301 6.94419C13.014 7.06647 13.125 7.27561 13.125 7.49998C13.125 7.72435 13.014 7.93349 12.8301 8.05576L9.12639 10.5179C8.92711 10.6504 8.67291 10.6607 8.46401 10.5447C8.2551 10.4288 8.12501 10.2052 8.12501 9.9621V5.03786C8.12501 4.79477 8.2551 4.57119 8.46401 4.45524ZM11.2876 7.49998L9.42131 8.74062V6.25934L11.2876 7.49998Z"></path></svg>,
                    title: 'LIVE Creator Hub'
                }
            ]
        }
    },
    {
        icon: <svg width="1em" data-e2e="" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M11 2C7.68629 2 5 4.68629 5 8V40C5 43.3137 7.68629 46 11 46H37C40.3137 46 43 43.3137 43 40V8C43 4.68629 40.3137 2 37 2H11ZM9 8C9 6.89543 9.89543 6 11 6H37C38.1046 6 39 6.89543 39 8V40C39 41.1046 38.1046 42 37 42H11C9.89543 42 9 41.1046 9 40V8ZM26.063 14.1175C25.7306 13.4415 25.0465 13.0096 24.2933 13.0002C23.54 12.9907 22.8453 13.4054 22.4961 14.0729L15.6945 27.0746L12.4672 33.1814C12.2092 33.6697 12.3958 34.2747 12.8841 34.5328L14.6524 35.4672C15.1407 35.7253 15.7457 35.5386 16.0038 35.0503L18.6718 30.0017H29.4421L32.0324 35.0274C32.2854 35.5183 32.8885 35.7112 33.3794 35.4581L35.1572 34.5419C35.6481 34.2888 35.8409 33.6858 35.5879 33.1948L32.4477 27.1022L26.063 14.1175ZM27.4492 26.0017H20.77L24.213 19.4202L27.4492 26.0017Z"></path>
        </svg>,
        title: 'English',
        children: {
            title: 'Language',
            menuItems: [
                {
                    code: 'en',
                    title: 'English'
                },
                {
                    code: 'vi',
                    title: 'Vietnamese'
                }
            ],
        }

    },
    {
        icon: <svg width="1em" data-e2e="" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6ZM2 24C2 11.8497 11.8497 2 24 2C36.1503 2 46 11.8497 46 24C46 36.1503 36.1503 46 24 46C11.8497 46 2 36.1503 2 24ZM24.0909 15C22.172 15 20.3433 16.2292 19.2617 18.61C19.0332 19.1128 18.4726 19.4 17.9487 19.2253L16.0513 18.5929C15.5274 18.4182 15.2406 17.8497 15.4542 17.3405C16.9801 13.7031 20.0581 11 24.0909 11C28.459 11 32 14.541 32 18.9091C32 21.2138 30.7884 23.4606 29.2167 25.074C27.8157 26.5121 25.5807 27.702 22.9988 27.9518C22.4491 28.0049 22.0001 27.5523 22.0001 27V25C22.0001 24.4477 22.4504 24.0057 22.9955 23.9167C24.2296 23.7153 25.5034 23.1533 26.3515 22.2828C27.4389 21.1666 28 19.8679 28 18.9091C28 16.7502 26.2498 15 24.0909 15ZM24 36C22.3431 36 21 34.6569 21 33C21 31.3431 22.3431 30 24 30C25.6569 30 27 31.3431 27 33C27 34.6569 25.6569 36 24 36Z"></path>
        </svg>,
        title: 'Feedback and help',
        to: '/feedback'
    },
    {
        icon: <svg width="1em" data-e2e="" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M20.3019 6.38068C21.723 6.08373 22.9615 7.16986 23.009 8.50693C23.2751 16.0034 29.4377 22 37 22C37.8141 22 38.6105 21.9307 39.3839 21.7982C40.7019 21.5723 42 22.5655 42 24C42 33.9411 33.9411 42 24 42C14.0589 42 6 33.9411 6 24C6 15.3248 12.1351 8.0871 20.3019 6.38068ZM19.2223 10.8358C13.8426 12.7885 10 17.9473 10 24C10 31.732 16.268 38 24 38C31.06 38 36.8994 32.7742 37.8611 25.9797C37.5756 25.9932 37.2886 26 37 26C28.0237 26 20.5827 19.4301 19.2223 10.8358Z"></path>
        </svg>,
        title: 'Dark mode',
        children: {
            title: 'Dark mode',
            menuItems: [
                {
                    title: 'Use device theme',
                },
                {
                    title: 'Dark mode'
                },
                {
                    title: 'Light mode'
                }
            ],
        }
    }

];
function Header() {
    const [searchResults, setSearchResults] = useState([]);
    useEffect(() => {
        setTimeout(() => {
            setSearchResults([
                { username: 'nd.trg281', nameAccounted: 'Tập làm IT', avatar: 'https://p9-sign-sg.tiktokcdn.com/aweme/1080x1080/tos-alisg-avt-0068/336f384d3b734435f031ecf4b0c4ebdc.jpeg?lk3s=a5d48078&nonce=89008&refresh_token=d7feae455d146ec97573b44b681e5a7e&x-expires=1736503200&x-signature=2zt5%2B18msRTPN3xw7uL3%2Beicy%2Fc%3D&shp=a5d48078&shcp=81f88b70', verified: false },
                { username: 'hades.studio', nameAccounted: 'HADES STUDIO', avatar: 'https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/06a69b8d6d75b1d0ef5f48ada128c505~c5_1080x1080.jpeg?lk3s=a5d48078&nonce=24854&refresh_token=4d810f952f370f03483ebb2d2bd36ef5&x-expires=1736503200&x-signature=omIKAancgwJLKdACNzyYCETvNAk%3D&shp=a5d48078&shcp=81f88b70', verified: false },
                { username: 'hada.kr', nameAccounted: 'HADA', avatar: 'https://p16-sign-sg.tiktokcdn.com/aweme/1080x1080/tos-alisg-avt-0068/ef5e7047d64c4f0991f994dabd9ff4f9.jpeg?lk3s=a5d48078&nonce=18909&refresh_token=4e789f231063d62372951b9d6a95c294&x-expires=1736503200&x-signature=UpGaEMf0tFoz0r2KUu%2FZSlVboOw%3D&shp=a5d48078&shcp=81f88b70', verified: true },
                { username: 'trtthang04', nameAccounted: 'nào tháo niềng thì đổi tên', avatar: 'https://p16-sign-sg.tiktokcdn.com/aweme/1080x1080/tos-alisg-avt-0068/c926cffffc74261c564cfdbc230f6e3b.jpeg?lk3s=a5d48078&nonce=1286&refresh_token=e9e551deb0fd7e8223df68b0a7dc234e&x-expires=1736510400&x-signature=0PdC5MaKtLL0Hsxk2%2BUyFUUwoXs%3D&shp=a5d48078&shcp=81f88b70', verified: true },
            ]);
        }, 0);
    });

    const handleMenuChange = (menuItem) => {
        console.log(menuItem);
    };

    const currentUser = true;

    return (
        <header className={cx("wrapper")}>
            <div className={cx("content")}>
                <Link className={cx('logo__link')} to="/">
                    <svg xmlns="http://www.w3.org/2000/svg" width="118" height="42" fill="currentColor" alt="TikTok">
                        <path fill="#25F4EE" d="M9.875 16.842v-1.119A9 9 0 0 0 8.7 15.64c-4.797-.006-8.7 3.9-8.7 8.708a8.7 8.7 0 0 0 3.718 7.134A8.68 8.68 0 0 1 1.38 25.55c0-4.737 3.794-8.598 8.495-8.707"></path>
                        <path fill="#25F4EE" d="M10.086 29.526c2.14 0 3.89-1.707 3.967-3.83l.006-18.968h3.463a7 7 0 0 1-.11-1.202h-4.726l-.006 18.969a3.98 3.98 0 0 1-3.967 3.829 3.9 3.9 0 0 1-1.846-.46 3.95 3.95 0 0 0 3.22 1.662m13.905-16.36v-1.055a6.5 6.5 0 0 1-3.583-1.068 6.57 6.57 0 0 0 3.583 2.123"></path>
                        <path fill="#FE2C55" d="M20.409 11.044a6.54 6.54 0 0 1-1.616-4.316h-1.265a6.56 6.56 0 0 0 2.88 4.316M8.706 20.365a3.98 3.98 0 0 0-3.973 3.976c0 1.528.869 2.858 2.134 3.523a3.94 3.94 0 0 1-.754-2.321 3.98 3.98 0 0 1 3.973-3.976c.409 0 .805.07 1.175.185v-4.833a9 9 0 0 0-1.175-.083c-.07 0-.134.006-.204.006v3.708a4 4 0 0 0-1.176-.185"></path>
                        <path fill="#FE2C55" d="M23.992 13.166v3.676c-2.453 0-4.727-.786-6.58-2.116v9.622c0 4.8-3.902 8.713-8.706 8.713a8.67 8.67 0 0 1-4.988-1.579 8.7 8.7 0 0 0 6.368 2.781c4.797 0 8.707-3.906 8.707-8.714v-9.621a11.25 11.25 0 0 0 6.579 2.116v-4.73q-.72-.002-1.38-.148"></path>
                        <path fill="currentColor" d="M17.413 24.348v-9.622a11.25 11.25 0 0 0 6.58 2.116v-3.676a6.57 6.57 0 0 1-3.584-2.123 6.6 6.6 0 0 1-2.888-4.315H14.06l-.006 18.968a3.98 3.98 0 0 1-3.967 3.83A3.99 3.99 0 0 1 6.86 27.87a3.99 3.99 0 0 1-2.133-3.523A3.98 3.98 0 0 1 8.7 20.372c.409 0 .805.07 1.175.185v-3.708c-4.701.103-8.495 3.964-8.495 8.701 0 2.29.888 4.373 2.338 5.933a8.67 8.67 0 0 0 4.988 1.58c4.798 0 8.707-3.913 8.707-8.714m12.635-11.17h14.775l-1.355 4.232h-3.832v15.644h-4.778V17.41l-4.804.006zm38.984 0h15.12l-1.355 4.232h-4.17v15.644h-4.785V17.41l-4.804.006zM45.73 19.502h4.733v13.553h-4.708zm6.617-6.374h4.733v9.257l4.689-4.61h5.646l-5.934 5.76 6.644 9.52h-5.213l-4.433-6.598-1.405 1.362v5.236H52.34V13.128zm50.143 0h4.734v9.257l4.688-4.61h5.647l-5.934 5.76 6.643 9.52h-5.206l-4.433-6.598-1.405 1.362v5.236h-4.734zm-54.397 4.826a2.384 2.384 0 0 0 2.382-2.384 2.384 2.384 0 1 0-2.382 2.384"></path>
                        <path fill="#25F4EE" d="M83.545 24.942a8.11 8.11 0 0 1 7.473-8.087 9 9 0 0 0-.709-.026c-4.478 0-8.106 3.631-8.106 8.113s3.628 8.113 8.106 8.113c.21 0 .498-.013.71-.026-4.178-.326-7.475-3.823-7.475-8.087"></path>
                        <path fill="#FE2C55" d="M92.858 16.83c-.217 0-.505.012-.716.025a8.11 8.11 0 0 1 7.468 8.087 8.11 8.11 0 0 1-7.468 8.087c.211.02.499.026.716.026 4.478 0 8.106-3.631 8.106-8.113s-3.628-8.113-8.106-8.113"></path>
                        <path fill="currentColor" d="M91.58 28.887a3.94 3.94 0 0 1-3.94-3.945 3.94 3.94 0 1 1 7.882 0c0 2.18-1.77 3.945-3.942 3.945m0-12.058c-4.477 0-8.106 3.631-8.106 8.113s3.629 8.113 8.106 8.113 8.106-3.631 8.106-8.113-3.628-8.113-8.106-8.113"></path>
                    </svg>
                </Link>

                <form className={cx( 'search-wrapper')}>
                    <Tippy
                        visible={searchResults.length > 0}
                        interactive={true}
                        placement='bottom'
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
                                                    verified={result.verified}
                                                />
                                            )}
                                        </ul>
                                    </PopperWrapper>
                                </div>
                            )
                        }}
                    >
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
                    </Tippy>
                </form>
                {currentUser ?

                    <div className={cx('actions')}>
                        <Link to="/upload" className={cx('actions__upload')} >
                            <svg className="css-qeydvm-StyledPlusIcon e1on1cg35" width="1em" data-e2e="" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M8 2.5C7.58579 2.5 7.25 2.83579 7.25 3.25V7.25H3.25C2.83579 7.25 2.5 7.58579 2.5 8C2.5 8.41421 2.83579 8.75 3.25 8.75H7.25V12.75C7.25 13.1642 7.58579 13.5 8 13.5C8.41421 13.5 8.75 13.1642 8.75 12.75V8.75H12.75C13.1642 8.75 13.5 8.41421 13.5 8C13.5 7.58579 13.1642 7.25 12.75 7.25H8.75V3.25C8.75 2.83579 8.41421 2.5 8 2.5Z"></path></svg>
                            <span>Upload</span>
                        </Link>
                        <Link to="/inbox" className={cx(['actions__inbox', 'tooltip'])} data-tooltip='inbox'>
                            <svg className="css-1g0p6jv-StyledInboxIcon e1xroc441" width="32" data-e2e="" height="32" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24.0362 21.3333H18.5243L15.9983 24.4208L13.4721 21.3333H7.96047L7.99557 8H24.0009L24.0362 21.3333ZM24.3705 23.3333H19.4721L17.2883 26.0026C16.6215 26.8176 15.3753 26.8176 14.7084 26.0026L12.5243 23.3333H7.62626C6.70407 23.3333 5.95717 22.5845 5.9596 21.6623L5.99646 7.66228C5.99887 6.74352 6.74435 6 7.66312 6H24.3333C25.2521 6 25.9975 6.7435 26 7.66224L26.0371 21.6622C26.0396 22.5844 25.2927 23.3333 24.3705 23.3333ZM12.6647 14C12.2965 14 11.998 14.2985 11.998 14.6667V15.3333C11.998 15.7015 12.2965 16 12.6647 16H19.3313C19.6995 16 19.998 15.7015 19.998 15.3333V14.6667C19.998 14.2985 19.6995 14 19.3313 14H12.6647Z"></path></svg>
                        </Link>
                        <Avatar dataSize='32px' image={images.avatar} altValue='User' />
                    </div> :
                    <div className={cx('actions')}>
                        <Button primary to="/login">Login</Button>
                        <Menu items={MENU_ITEMS} onChange={handleMenuChange}>
                            <button className={cx('more-btn')} >
                                <svg width="1em" data-e2e="" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 4C26.2091 4 28 5.79086 28 8C28 10.2091 26.2091 12 24 12C21.7909 12 20 10.2091 20 8C20 5.79086 21.7909 4 24 4ZM24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28C21.7909 28 20 26.2091 20 24C20 21.7909 21.7909 20 24 20ZM24 36C26.2091 36 28 37.7909 28 40C28 42.2091 26.2091 44 24 44C21.7909 44 20 42.2091 20 40C20 37.7909 21.7909 36 24 36Z"></path></svg>
                            </button>
                        </Menu>
                    </div>
                }
            </div >
        </header >
    );
}

export default Header;