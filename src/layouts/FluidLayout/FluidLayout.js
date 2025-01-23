import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./FluidLayout.module.scss"

const cx = classNames.bind(styles);

function MainLayout({ children }) {
    return (
        <div className={cx("wrapper")}>
            <main className={cx("content")}>
                {children}
            </main>
        </div>
    );
}

MainLayout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default MainLayout;