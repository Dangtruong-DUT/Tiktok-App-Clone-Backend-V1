import { useContext } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss"
import { Link } from "react-router-dom";
import images from "@/assets/images";
import Avatar from '@/components/Avatar';
import Button from '@/components/button';
import Menu from '@/components/Popper/components/Menu';
import Search from '../../Components/Search';
import config from '@/config';
import {
    LogoBrand, PlusIcon,
    ThreeDotIcon,MailboxIcon
} from '@/components/Icons';
import { USER_MENU, MENU_ITEMS } from "@/constants/Menus";
import { ThemeContext } from "@/theme";

const cx = classNames.bind(styles);


const currentUser = true;
function Header() {
    const { setThemeMode } = useContext(ThemeContext);


    const handleMenuChange = (menuItem) => {
        if (menuItem.type === 'theme') {
            setThemeMode(menuItem.data);
        }
    };

    return (
        <header className={cx("wrapper")}>
            <div className={cx("content")}>
                <Link className={cx('logo__link')} to={config.home}>
                    <LogoBrand />
                </Link>
                <Search />
                {currentUser ?
                    (
                        <div className={cx('actions')}>
                            <Link to={config.upload} className={cx('actions__upload')} >
                                <PlusIcon width='1em' height='1em' />
                                <span>Upload</span>
                            </Link>
                            <Link to="/inbox" className={cx(['actions__inbox', 'tooltip'])} data-tooltip='inbox'>
                                <div className={cx('mailbox')} data-inbox='1'>
                                    <MailboxIcon width='32' height='32' />
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