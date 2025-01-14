import classNames from "classnames/bind";
import styles from './SuggestedAccounts.module.scss';
import PropTypes from "prop-types";
import AccountItem from "@/components/AccountItem";


const cx = classNames.bind(styles);

function SuggestedAccounts({ title }) {
    return (
        <div className={cx('suggested-accounts')}>
            <p className={cx('suggested-accounts__title')}>{title}</p>
            <ul>
                <li >
                    <AccountItem
                        className={cx('suggested-accounts__account')}
                        key={2}
                        avatarSize='32px'
                        avatar={'https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/7b19e9294d9c3e7bc45be1df71fea2ea.jpeg?lk3s=a5d48078&nonce=64010&refresh_token=5a5b66ab32dbb472940cbdaee15f0210&x-expires=1736953200&x-signature=CQxEdMyRDHrBYmr%2BLdubpmfQNzw%3D&shp=a5d48078&shcp=81f88b70'}
                        username={'John Doe'}
                        nameAccount={'John Doe'}
                        verified={true}
                        isLive = {true} 
                    />
                </li>
                <li >
                    <AccountItem
                        className={cx('suggested-accounts__account')}
                        key={2}
                        avatarSize='32px'
                        avatar={'https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/7b19e9294d9c3e7bc45be1df71fea2ea.jpeg?lk3s=a5d48078&nonce=64010&refresh_token=5a5b66ab32dbb472940cbdaee15f0210&x-expires=1736953200&x-signature=CQxEdMyRDHrBYmr%2BLdubpmfQNzw%3D&shp=a5d48078&shcp=81f88b70'}
                        username={'John Doe'}
                        nameAccount={'John Doe'}
                        verified={true}
                    />
                </li>
            </ul>
            <button className={cx('suggested-accounts__cta')}>See more</button>
        </div>
    );
}

SuggestedAccounts.propTypes = {
    className: PropTypes.string,
};

export default SuggestedAccounts;