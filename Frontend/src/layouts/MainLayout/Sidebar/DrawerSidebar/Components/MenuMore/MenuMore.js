import Menu from "@/layouts/MainLayout/Sidebar/DrawerSidebar/Components/MenuMore/Menu";
import { MENU_ITEMS, USER_MENU } from "@/constants/Menus";

function MenuMore({ isUser, onChange, onClose}) {
    return (
        <Menu
            items={
                !isUser ? MENU_ITEMS : USER_MENU
            }
            onChange={onChange}
            onClose={onClose}
            useIcon={false}
            useSubmenuIcon={true}
            title = "More"
        />);
}

export default MenuMore;