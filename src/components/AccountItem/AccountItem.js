import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from './AccountItem.module.scss';
import Avatar from "@/components/Avatar";
import { TickMackIcon } from "../Icons";
import { Link } from "react-router-dom";


const cx = classNames.bind(styles);

function AccountItem({
    username,
    nameAccount,
    verified,
    avatar,
    avatarSize = '32px',
    className,
    isLive = false,
    onClick 
}) {
    const classNames = cx('wrapper', className);
    return (
        <div className={classNames} onClick= {onClick}>
            <Link className={cx('accountItem-content')} to={`/@${username}`}>
                <Avatar isLive={isLive} image={avatar} dataSize={avatarSize} altValue={nameAccount} />
                <div className={cx('info')}>
                    <h4 className={cx('info__username')}>
                        {username}
                        {verified &&
                            <span className={cx('info__verified')}>
                                <TickMackIcon width="20" height="20" />
                            </span>
                        }
                    </h4>
                    <p className={cx('info__name')}>
                        {nameAccount}
                    </p>
                </div>
            </Link>
        </div>
    );
}

AccountItem.propTypes = {
    avatarSize: PropTypes.string,
    username: PropTypes.string,
    nameAccount: PropTypes.string,
    avatar: PropTypes.string,
    verified: PropTypes.bool,
    isLive: PropTypes.bool
};


export default AccountItem;