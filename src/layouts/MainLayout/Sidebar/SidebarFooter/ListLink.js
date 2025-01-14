import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from './SidebarFooter.module.scss';
import Button from "@/components/button";
import { memo, useState } from "react";

const cx = classNames.bind(styles);

function ListLink({ title, items = [] }) {
    const [isDisplayLinks,setDisplayLinks] = useState(false);

    const handleDisplayListLink = () =>{
        setDisplayLinks((prev)=> !prev);
    }
    const classNames = cx('links', {
        displayLink: isDisplayLinks
    })
    return (
        <div className={classNames}>
            <h4 className={cx('links__title')} onClick={handleDisplayListLink}>{title}</h4>
            <div className={cx('links-listItems')}>
                {
                    items.map(item => (
                        <span key={item.id}>
                            <Button className={cx('links-listItems__item')} href={item.href}>{item.name}</Button>
                        </span>
                    ))
                }
            </div>
        </div>
    );
}
ListLink.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default memo(ListLink);