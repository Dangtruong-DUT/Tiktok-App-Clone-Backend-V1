import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react/headless';
import classNames from "classnames/bind";
import Styles from './Menu.module.scss'
import { PopperWrapper } from "@/components/Popper";
import MenuItem from './MenuItem';
import Header from './Header';
import { useState } from 'react';

const cx = classNames.bind(Styles);

function Menu({ hideOnClick = false, children, items = [], onChange }) {

    const [history, setHistory] = useState([{ menuItems: items }]);
    const current = history[history.length - 1]

    const renderItems = () => {
        return current.menuItems.map((item, index) => {
            const hasSubMenu = !!item.children;
            return (
                <MenuItem key={index}
                    className={cx('item')}
                    data={item}
                    onClick={() => {
                        if (hasSubMenu) {
                            setHistory(prev => [...prev, item.children])
                        } else {
                            onChange(item);
                        }
                    }}
                />
            )
        });
    };

    const renderMenuItem = (attrs) => {
        return (
            <div className={cx('list-items')} tabIndex={-1} {...attrs}>
                <PopperWrapper className={cx('menu-wrapper')}>
                    {
                        history.length > 1 &&
                        <Header title={current.title}
                            onBack={handleBackPrevMenu}
                        />
                    }
                    <div className={cx('menu-body')}>{renderItems()}</div>
                </PopperWrapper>
            </div>
        )
    }
    // Go to previous menu
    const handleBackPrevMenu = () => {
        setHistory(prev => prev.slice(0, prev.length - 1))
    }
    // Reset first menu
    const handleResetToFirstPage = () => {
        setHistory((prev) => prev.slice(0, 1));
    };
    return (
        <Tippy
            delay={[300, 500]}
            interactive
            offset={[12, 10]}
            placement='bottom-end'
            hideOnClick={hideOnClick}
            render={renderMenuItem}
            onHide={handleResetToFirstPage}
        >
            {children}
        </Tippy>);
}

Menu.propTypes = {
    hideOnClick: PropTypes.bool,
    children: PropTypes.node,
    items: PropTypes.array.isRequired,
    onChange: PropTypes.func

};

export default Menu;