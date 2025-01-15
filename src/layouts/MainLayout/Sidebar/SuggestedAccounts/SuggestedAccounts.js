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
                        avatar={'https://ttl.edu.vn/public/upload/2024/12/gai-xinh-cam-hoa-02.webp'}
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
                        avatar={'https://ttl.edu.vn/public/upload/2024/12/gai-xinh-cam-hoa-02.webp'}
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