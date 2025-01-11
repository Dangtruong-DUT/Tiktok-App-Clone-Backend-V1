import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./MainLayout.module.scss"
import Header from "./Header";
import Sidebar from "./Sidebar";

const cx = classNames.bind(styles);

function MainLayout({ children }) {
    return (
        <div className={cx("wrapper")}>
            <Header />
            <div className={cx("container")}>
                <Sidebar />
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