import { useContext, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import config from "@/config";
import {
    ExploreIcon, FollowingIcon,
    HomeIcon, LiveIcon,
    MailboxIcon, horizontalThreeDotIcon
} from "@/components/Icons";
import images from "@/assets/images";
import FriendsIcon from "@/components/Icons/FriendsIcon";
import MessagesIcon from "@/components/Icons/MessagesIcon";
import { Menu, MenuItem } from "./Menu";
import { SuggestedAccounts } from "./SuggestedAccounts";
import SidebarFooter from "./SidebarFooter";
import Avatar from "@/components/Avatar";
import { CallToAction } from "./CallToAction";
import UploadIcon from "@/components/Icons/UploadIcon";
import { SidebarHeader } from "./SidebarHeader";
import { useSidebar } from "../Context";
import DrawerSidebar from "./DrawerSidebar/DrawerSidebar";
import MenuMore from "./DrawerSidebar/Components/MenuMore/MenuMore";
import { SearchBar } from "./DrawerSidebar/Components/SearchBar";
import { ThemeContext } from "@/theme";

const cx = classNames.bind(styles);

function Sidebar() {
    const { isSmall, setSideBarSmallSize } = useSidebar();
    const [isShowDrawerBar, setShowDrawerBar] = useState(false);
    const [activeMenuItem, setActiveMenuItem] = useState(config.routes.home);
    const [drawerContent, setDrawerContent] = useState(null);

    const { setThemeMode } = useContext(ThemeContext);


    const handleMenuChange = (menuItem) => {
        if (menuItem.type === 'theme') {
            setThemeMode(menuItem.data);
        }
    };

    const toggleDrawerBar = (content) => {
        setSideBarSmallSize(true);
        setShowDrawerBar((prev) => !prev);
        setActiveMenuItem(null);
        setDrawerContent(content);
    };

    const closeDrawer = () => {
        setSideBarSmallSize(false);
        setShowDrawerBar(false);
        setActiveMenuItem(window.location.pathname);
        setDrawerContent(null);
    };

    const renderMenuItems = () => {
        const menuConfig = [
            { title: "For You", to: config.routes.home, Icon: HomeIcon },
            { title: "Explore", to: config.routes.explore, Icon: ExploreIcon },
            { title: "Following", to: config.routes.following, Icon: FollowingIcon },
            { title: "Friends", to: config.routes.friends, Icon: FriendsIcon },
            { title: "Upload", to: config.routes.upload, Icon: UploadIcon },
            { title: "Activity", to: config.routes.activity, Icon: MailboxIcon },
            { title: "Messages", to: config.routes.messages, Icon: MessagesIcon },
            { title: "Live", to: config.routes.live, Icon: LiveIcon },
            { title: "Profile", to: config.routes.profile, avatar: <Avatar dataSize="28px" image={images.avatar} altValue="user" /> },
            { title: "More", Icon: horizontalThreeDotIcon, content: "more" }
        ];

        return menuConfig.map((item, index) => (
            <MenuItem
                key={index}
                title={item.title}
                to={item.to}
                Icon={item.Icon}
                avatar={item.avatar}
                isActive={
                    item.content ? drawerContent === item.content : activeMenuItem === item.to
                }
                onClick={() =>
                    item.content ? toggleDrawerBar(item.content) : handleMenuItemClick(item.to)
                }
            />
        ));
    };

    const handleMenuItemClick = (link) => {
        setSideBarSmallSize(false);
        setActiveMenuItem(link);
        setShowDrawerBar(false);
        setDrawerContent(null);
    };

    return (
        <div className={cx("container")}>
            <aside className={cx("SideBar", { SlidingSidebar: isSmall })}>
                {isShowDrawerBar && (
                    <DrawerSidebar onClose={closeDrawer}>
                        {drawerContent === "search" && <SearchBar onClose={closeDrawer} />}
                        {drawerContent === "more" && <MenuMore onClose={closeDrawer} onChange={handleMenuChange}  />}
                    </DrawerSidebar>
                )}
                <SidebarHeader onToggleSearchBar={() => toggleDrawerBar("search")} />
                <div className={cx("sidebar-scroll-container")}>
                    <Menu>{renderMenuItems()}</Menu>
                    {!isSmall && (
                        <>
                            <CallToAction />
                            <SuggestedAccounts title={"Following accounts"} />
                            <SidebarFooter />
                        </>
                    )}
                </div>
            </aside>
        </div>
    );
}

export default Sidebar;
