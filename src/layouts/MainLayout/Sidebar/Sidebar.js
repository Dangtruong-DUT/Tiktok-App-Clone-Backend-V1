import classNames from "classnames/bind"
import styles from "./Sidebar.module.scss"
import config from "@/config";
import {
    ExploreIcon, FollowingIcon,
    HomeIcon, LiveIcon,
} from "@/components/Icons";
import images from "@/assets/images";
import FriendsIcon from "@/components/Icons/FriendsIcon";
import MessagesIcon from "@/components/Icons/MessagesIcon";
import { Menu, MenuItem } from "./Menu";
import { SuggestedAccounts } from "./SuggestedAccounts";
import SidebarFooter from "./SidebarFooter";
import Avatar from "@/components/Avatar";
import { CallToAction } from "./CallToAction";

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
                <MenuItem title="Profile" to={config.routes.profile}
                    avatar={<Avatar dataSize="28px" image={images.avatar} altValue="user" />} />
            </Menu>
            <CallToAction/>
            <SuggestedAccounts title={'Following accounts'} />
            <SidebarFooter />
        </aside>
    );
}

export default Sidebar;