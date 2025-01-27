import PropTypes from 'prop-types';
import classNames from "classnames/bind";
import Styles from './Menu.module.scss'
import MenuItem from './MenuItem';
import Header from './Header';
import { useState } from 'react';
import { DrawerSidebarHeader } from '../../DrawerSidebarHeader';

const cx = classNames.bind(Styles);

function Menu({
    title,
    items = [],
    onChange,
    useIcon = true,
    useSubmenuIcon = true,
    onClose
}) {
    const [history, setHistory] = useState([{ menuItems: items }]);
    const current = history[history.length - 1]

    const renderItems = () => {
        return current.menuItems.map((item, index) => {
            const hasSubMenu = !!item.children;
            return (
                <MenuItem key={index}
                    className={cx('item')}
                    data={item}
                    hasIcon={useIcon}
                    useSubMenuIcon={hasSubMenu && useSubmenuIcon}
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

    // Go to previous menu
    const handleBackPrevMenu = () => {
        setHistory(prev => prev.slice(0, prev.length - 1))
    }
    return (
        <div className={cx('list-items')}>
            {
                history.length === 1 ?
                    <DrawerSidebarHeader title={title} onExit={onClose} />
                    :
                    <Header title={current.title}
                        onBack={handleBackPrevMenu}
                    />
            }
            <div className={cx('menu-body')}>{renderItems()}</div>
        </div>
    );
}

Menu.propTypes = {
    items: PropTypes.array.isRequired,
    onChange: PropTypes.func

};

export default Menu;