import classNames from "classnames/bind"
import styles from "./Sidebar.module.scss"
import config from "@/config";
import {
    ExploreIcon, FollowingIcon,
    HomeIcon, LiveIcon, PersonIcon
} from "@/components/Icons";
import FriendsIcon from "@/components/Icons/FriendsIcon";
import MessagesIcon from "@/components/Icons/MessagesIcon";
import { Menu, MenuItem } from "./Menu";
import {SuggestedAccounts} from "./SuggestedAccounts";

const cx = classNames.bind(styles);

function Sidebar() {
    return (
        <aside className={cx("wrapper")}>
            <Menu>
                <MenuItem title="For You" to={config.routes.home} Icon={HomeIcon} />
                <MenuItem title="Explore" to={config.routes.explore} Icon={ExploreIcon} />
                <MenuItem title="Following" to={config.routes.following} Icon={FollowingIcon} />
                <MenuItem title="Friends" to={config.routes.friends} Icon={FriendsIcon} />
                <MenuItem title="Live" to={config.routes.live} Icon={LiveIcon} />
                <MenuItem title="Messages" to={config.routes.messages} Icon={MessagesIcon} />
                <MenuItem title="Profile" to={config.routes.profile} Icon={PersonIcon} />
            </Menu>
            <SuggestedAccounts title={'Following accounts'}/>
        </aside>
    );
}

export default Sidebar;