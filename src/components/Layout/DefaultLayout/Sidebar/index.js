import classNames from "classnames/bind"
import styles from "../DefaultLayout.module.scss"

const cx = classNames.bind(styles);

function Sidebar() {
    return (
        <aside className = { cx("wrapper")}>
            <nav className ={ cx("content")}>
                <ul>
                    <li><a href="#">For You</a></li>
                    <li><a href="#">Explore</a></li>
                    <li><a href="#">Following</a></li>
                    <li><a href="#">Friends</a></li>
                    <li><a href="#">LIVES</a></li>
                    <li><a href="#">Messages</a></li>
                    <li><a href="#">Profile</a></li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;