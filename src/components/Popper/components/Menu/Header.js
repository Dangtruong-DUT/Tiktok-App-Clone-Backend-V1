import PropTypes from "prop-types";
import classNames from "classnames/bind";
import Styles from "./Menu.module.scss";
import { ChevronLeftIcon } from '@/components/Icons';

const cx = classNames.bind(Styles);

function Header({ title, onBack }) {

    return (
        <header className={cx("list-items__header")}>
            <button className={cx("header__btn-back")} onClick={onBack}>
                <ChevronLeftIcon width='1em' height='1em' />
            </button>
            <h4 className={cx("header__title")}>{title}</h4>
        </header >
    );

}

Header.propTypes = {
    title: PropTypes.string.isRequired,
    onBack: PropTypes.func.isRequired
};
export default Header;