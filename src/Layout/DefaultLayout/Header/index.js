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
import { ClearIcon, LogoBrand, PersonIcon, PlusIcon, SearchIcon, SpinnerIcon, ThreeDotIcon, CoinIcon, CreateIcon, BusinessSuiteIcon, SettingIcon, InfoIcon, LightBulbIcon, WaningMoonIcon, LogoutIcon, LetterAIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

const MENU_ITEMS = [
    {
        icon: <CreateIcon width='1em' height='1em' />,
        title: 'Creator tools',
        children: {
            title: 'Creator tools',
            menuItems: [
                {
                    icon: <LightBulbIcon width='1em' height='1em' />,
                    title: 'LIVE Creator Hub'
                }
            ]
        }
    },
    {
        icon: <LetterAIcon width='1em' height='1em' />,
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
        icon: <LightBulbIcon width='1em' height='1em' />,
        title: 'Feedback and help',
        to: '/feedback'
    },
    {
        icon: <WaningMoonIcon width='1em' height='1em' />,
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

const USER_MENU = [
    {
        icon: <PersonIcon width='1em' height='1em' />,
        title: 'View profile',
        to: '/profile'
    },
    {
        icon: <CoinIcon width='1em' height='1em' />,
        title: 'Get Coins',
        to: '/get-coins'
    },
    {
        icon: <CreateIcon width='1em' height='1em' />,
        title: 'Creator tools',
        children: {
            title: 'Creator tools',
            menuItems: [
                {
                    icon: <LightBulbIcon width='1em' height='1em' />,
                    title: 'LIVE Creator Hub'
                }
            ]
        }
    },
    {
        icon: <BusinessSuiteIcon width='1em' height='1em' />,
        title: 'Business Suite',
        to: '/business- Suite'

    },
    {
        icon: <SettingIcon width='1em' height='1em' />,
        title: 'Settings',
        to: '/settings'

    }, {
        icon: <LetterAIcon width='1em' height='1em' />,
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
        icon: <InfoIcon width='1em' height='1em' />,
        title: 'Feedback and help',
        to: '/feedback'
    },
    {
        icon: <WaningMoonIcon width='1em' height='1em' />,
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
    },
    {
        icon: <LogoutIcon width='1em' height='1em' />,
        title: 'Log out',
        to: '/logout',
        separate: true

    }
]
const currentUser = true;
function Header() {

    const handleMenuChange = (menuItem) => {
        console.log(menuItem);
    };



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
    return (
        <header className={cx("wrapper")}>
            <div className={cx("content")}>
                <Link className={cx('logo__link')} to="/">
                    <LogoBrand />
                </Link>

                <form className={cx('search-wrapper')}>
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
                                <ClearIcon width='16' height='16' />
                            </div>
                            <div className={cx('search__icon-spinner')}>
                                <SpinnerIcon width='24' />
                            </div>
                            <span className={cx('search__separate')} ></span>
                            <button className={cx('search__btn-submit')} type='submit'>
                                <SearchIcon width='24' height='24' />
                            </button>
                        </div>
                    </Tippy>
                </form>
                {currentUser ?
                    (

                        <div className={cx('actions')}>
                            <Link to="/upload" className={cx('actions__upload')} >
                                <PlusIcon width='1em' height='1em' />
                                <span>Upload</span>
                            </Link>
                            <Link to="/inbox" className={cx(['actions__inbox', 'tooltip'])} data-tooltip='inbox'>
                                <svg className="css-1g0p6jv-StyledInboxIcon e1xroc441" width="32" data-e2e="" height="32" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24.0362 21.3333H18.5243L15.9983 24.4208L13.4721 21.3333H7.96047L7.99557 8H24.0009L24.0362 21.3333ZM24.3705 23.3333H19.4721L17.2883 26.0026C16.6215 26.8176 15.3753 26.8176 14.7084 26.0026L12.5243 23.3333H7.62626C6.70407 23.3333 5.95717 22.5845 5.9596 21.6623L5.99646 7.66228C5.99887 6.74352 6.74435 6 7.66312 6H24.3333C25.2521 6 25.9975 6.7435 26 7.66224L26.0371 21.6622C26.0396 22.5844 25.2927 23.3333 24.3705 23.3333ZM12.6647 14C12.2965 14 11.998 14.2985 11.998 14.6667V15.3333C11.998 15.7015 12.2965 16 12.6647 16H19.3313C19.6995 16 19.998 15.7015 19.998 15.3333V14.6667C19.998 14.2985 19.6995 14 19.3313 14H12.6647Z"></path></svg>
                            </Link>
                            <Menu items={USER_MENU} onChange={handleMenuChange}>
                                <button>
                                    <Avatar dataSize='32px' image={images.avatar} altValue='User' />
                                </button>
                            </Menu>
                        </div>) :
                    (
                        <div className={cx('actions')}>
                            <Button primary to="/login">Login</Button>
                            <Menu items={MENU_ITEMS} onChange={handleMenuChange}>
                                <button className={cx('more-btn')} >
                                    <ThreeDotIcon width='1em' height='1em' />
                                </button>
                            </Menu>
                        </div>
                    )
                }
            </div >
        </header >
    );
}

export default Header;