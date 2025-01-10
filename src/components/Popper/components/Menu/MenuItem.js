import classNames from "classnames/bind";
import Styles from './Menu.module.scss'
import Button from "@/components/button";

const cx = classNames.bind(Styles);

function MenuItem({ data, onClick }) {

    const  classes = cx('list-items__item', {
        separate: data.separate
    })

    return (
        <Button className={classes}
            leftIcon={data.icon}
            to={data.to}
            onClick={onClick}
        >
            {data.title}
        </Button>
    );
}

export default MenuItem;