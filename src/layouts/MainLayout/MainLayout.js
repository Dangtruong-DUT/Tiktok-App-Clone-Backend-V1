import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./MainLayout.module.scss"
import Sidebar from "./Sidebar";
import { SidebarProvider } from "./Context";

const cx = classNames.bind(styles);

function MainLayout({ children }) {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("container")}>
                <SidebarProvider>
                    <Sidebar />
                </SidebarProvider>
                <main className={cx("content")}>
                    {children}
                </main>
            </div>
        </div>
    );
}

MainLayout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default MainLayout;