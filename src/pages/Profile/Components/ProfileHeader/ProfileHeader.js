import Avatar from '@/components/Avatar';
import styles from './ProfileHeader.module.scss';
import classNames from 'classnames/bind';
import Button from '@/components/button';
import { SettingIcon, ShareIcon } from '@/components/Icons';
import EditIcon from '@/components/Icons/EditIcon';

const cx = classNames.bind(styles);

function ProfileHeader({ nickname, name, bio, avatar, following, followers, likes }) {
    return (
        <div className={cx('wrapper')}>
            <Avatar dataSize='150px' className={cx('profile-avatar')} image={avatar} alt={nickname} />
            <div className={cx('profile-info')}>
                <div className={cx('profile-info__row')}>
                    <h1 className={cx('profile-info__name')}>{name}</h1>
                    <h2 className={cx('profile-info__nickName')}>{nickname}</h2>
                </div>
                <div className={cx('profile-info__row')}>
                    <Button primary className={cx('profile-info__btn')} >

                        <span className={cx('profile-info-btn__icon')}>
                            <EditIcon className={cx('profile-info-btn__icon')} width='1.2em' height='1.2em' />
                        </span>
                        <span className={cx('profile-info-btn__title')}>
                            Edit Profile
                        </span>
                    </Button>
                    <Button className={cx('profile-info__btn', 'profile-info__btn--secondary')} >
                        <span className={cx('profile-info-btn__icon')}>
                            <SettingIcon width='1.2em' height='1.2em' />
                        </span>
                        <span className={cx('profile-info-btn__title')}>
                            settings
                        </span>
                    </Button>
                    <Button className={cx('profile-info__btn', 'profile-info__btn--secondary', 'profile-info__btn--small')}>
                        <ShareIcon bold={false} width='1.2em' height='1.2em' />
                    </Button>
                </div>
                <div className={cx('profile-info__row')}>
                    <h3 className={cx('stats')}>
                        <div >
                            <strong className={cx('stats__value')}>{following}</strong>
                            <span className={cx('stats__desc')}> Following</span>
                        </div>
                        <div >
                            <strong className={cx('stats__value')}>{followers} </strong>
                            <span className={cx('stats__desc')}> followers</span>
                        </div>
                        <div >
                            <strong className={cx('stats__value')}>{likes}</strong>
                            <span className={cx('stats__desc')}> Likes</span>
                        </div>
                    </h3>
                </div>
                <h2 className={cx('profile-info__row')}>
                    <p className={cx('profile-info__bio')}>{bio}</p>
                </h2>

            </div>
        </div>
    );
}

export default ProfileHeader;
