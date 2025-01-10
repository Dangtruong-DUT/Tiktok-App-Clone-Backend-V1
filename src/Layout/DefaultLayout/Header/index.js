import classNames from "classnames/bind";
import styles from "./Header.module.scss"
import { Link } from "react-router-dom";
import images from "@/assets/images";
import Avatar from '@/components/Avatar';
import Button from '@/components/button';
import Menu from '@/components/Popper/components/Menu';
import Search from '../../Components/Search';
import {
     LogoBrand, PersonIcon, PlusIcon,
     ThreeDotIcon, CoinIcon, CreateIcon, BusinessSuiteIcon,
    SettingIcon, InfoIcon, LightBulbIcon, WaningMoonIcon, LogoutIcon,
    LetterAIcon,
    MailboxIcon
} from '@/components/Icons';

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

    return (
        <header className={cx("wrapper")}>
            <div className={cx("content")}>
                <Link className={cx('logo__link')} to="/">
                    <LogoBrand />
                </Link>
                <Search />
                {currentUser ?
                    (

                        <div className={cx('actions')}>
                            <Link to="/upload" className={cx('actions__upload')} >
                                <PlusIcon width='1em' height='1em' />
                                <span>Upload</span>
                            </Link>
                            <Link to="/inbox" className={cx(['actions__inbox', 'tooltip'])} data-tooltip='inbox'>
                            <div className={cx('mailbox')} data-inbox='122'>
                                <MailboxIcon width='32' height='32'/>
                            </div>
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