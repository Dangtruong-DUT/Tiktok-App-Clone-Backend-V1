import classNames from "classnames/bind";
import Styles from './Menu.module.scss'
import Button from "@/components/button";

const cx = classNames.bind(Styles);

function MenuItem({ data, onClick }) {
    return (
        <Button className={cx('list-items__item')}
            leftIcon={data.icon}
            to={data.to}
            onClick={onClick}
        >
            {data.title}
        </Button>
    );
}

export default MenuItem;