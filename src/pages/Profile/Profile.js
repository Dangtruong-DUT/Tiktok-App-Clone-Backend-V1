import styles from './Profile.module.scss';
import classNames from 'classnames/bind';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProfileHeader } from './Components/ProfileHeader';
import { TabBar } from './Components/Tabbar';
import { VideoGrid } from './Components/VideoGrid';
import GridIcon from '@/components/Icons/GridIcon';
import { FavoritesIcon, LikeIcon } from '@/components/Icons';
import { useUserData } from '@/hooks/useUserData';

const cx = classNames.bind(styles);

function Profile() {
    const { username } = useParams();
    const { userData, loading, error } = useUserData(username);


    const tabs = useMemo(() => [
        { heading: 'Videos', icon: <GridIcon width="1.2em" height="1.2em" /> },
        { heading: 'Favorites', icon: <FavoritesIcon width="1.2em" height="1.2em" unWatching /> },
        { heading: 'Liked', icon: <LikeIcon width="1.2em" height="1.2em" unWatch /> },
    ], []);

    const [ activeTab, setActiveTab ] = useState(tabs[0].heading);


    if (loading) {
        return <div className={cx('loader')}>Loading...</div>;
    }

    if (error || !userData) {
        return <div className={cx('error')}>Error: {error || 'Unable to fetch user data.'}</div>;
    }

    return (
        <div className={cx('wrapper')}>
            <ProfileHeader
                name={`${userData.last_name} ${userData.first_name}`}
                nickname={userData.nickname}
                bio={userData.bio}
                avatar={userData.avatar}
                following={userData.followings_count}
                followers={userData.followers_count}
                likes={userData.likes_count}
                tick={userData.tick}
            />
            <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <VideoGrid videos={userData.videos || []} />
            {userData.videos?.length === 0 && <p>No videos available.</p>}
        </div>
    );
}

export default Profile;
