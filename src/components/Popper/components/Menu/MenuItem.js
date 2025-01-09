import classNames from "classnames/bind";
import Styles from './Menu.module.scss'
import Button from "@/components/button";

const cx = classNames.bind(Styles);

function MenuItem({data}) {
    return ( 
        <Button className= {cx('menu-item')} leftIcon={data.icon} to={data.to}>
            {data.title}
        </Button>
     );
}

export default MenuItem;