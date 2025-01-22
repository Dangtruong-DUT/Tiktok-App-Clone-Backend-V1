import PropTypes from "prop-types";
import classNames from "classnames/bind";
import Styles from './Menu.module.scss'
import Button from "@/components/button";
import { ChevronLeftIcon } from "../../../../../../../components/Icons";

const cx = classNames.bind(Styles);

function MenuItem({ data, onClick, useSubMenuIcon, hasIcon }) {

    const classes = cx('list-items__item', {
        separate: data.separate
    })

    return (
        <Button className={classes}
            leftIcon={hasIcon && data.icon}
            to={data.to}
            onClick={onClick}
            rightIcon={useSubMenuIcon
                &&
                <ChevronLeftIcon className={cx('item__icon-more')} width="1.6rem" height="1.6rem" rotate="180deg" />
            }
        >
            {data.title}
        </Button>
    );
}

MenuItem.propTypes = {
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func
};

export default MenuItem;