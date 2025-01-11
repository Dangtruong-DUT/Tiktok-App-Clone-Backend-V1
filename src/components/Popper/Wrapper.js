import classNames from "classnames/bind";
import Styles from "./Popper.module.scss";

const cx = classNames.bind(Styles);

function Wrapper({ children , className}) {
    const classNames = cx("wrapper", className);
    return (
        <div className={classNames}>
            {children}
        </div>
    );
}

export default Wrapper;