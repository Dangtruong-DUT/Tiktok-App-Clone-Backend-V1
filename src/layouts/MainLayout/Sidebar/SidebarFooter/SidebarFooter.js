import classNames from "classnames/bind"
import Styles from './SidebarFooter.module.scss';
import ListLink from './ListLink';
import images from "@/assets/images";
import { LINKS_FOR_COMPANY, LINKS_FOR_TERM_POLICY,
     LINKS_FOR_PROGRAM } from '@/constants/Links';

const cx = classNames.bind(Styles);

function SidebarFooter() {
    return (
        <footer className={cx('sidebar-footer')}>
            <div className={cx('sidebar-banner')}>
                <a href="tiktok.com" className={cx('sidebar-banner__link')}>
                    <img className={cx('sidebar-banner__link-img')} src={images.titokCreateImage}
                        alt='Create TikTok effects, get a reward' />
                    <h4 className={cx('sidebar-banner__link-heading')} >Create TikTok effects, get a reward</h4>
                </a>
            </div>
            <ListLink title={'Company'} items={LINKS_FOR_COMPANY} />
            <ListLink title={'Program'} items={LINKS_FOR_PROGRAM} />
            <ListLink title={'Terms & Policies'} items={LINKS_FOR_TERM_POLICY} />
            <span className={cx('sidebar-footer__cpr')}>&copy; 2025 TikTok</span>
        </footer>
    );
}

export default SidebarFooter;