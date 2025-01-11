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
                            onChange(item.title);
                        }
                    }}
                />
            )
        });
    };
    return (
        <Tippy
            delay={[300, 500]}
            interactive
            offset={[12, 10]}
            placement='bottom-end'
            hideOnClick={hideOnClick}
            render={(attrs) => {
                return (
                    <div className={cx('list-items')} tabIndex={-1} {...attrs}>
                        <PopperWrapper className={cx('menu-wrapper')}>
                            {
                                history.length > 1 &&
                                <Header title={current.title}
                                    onBack={() => {
                                        setHistory(prev => prev.slice(0, prev.length - 1))
                                    }}
                                />
                            }
                            <div className={cx('menu-body')}>{renderItems()}</div>
                        </PopperWrapper>
                    </div>
                )
            }}
            onHide={
                () => {
                    setHistory((prev) => prev.slice(0, 1));
                }
            }
        >
            {children}
        </Tippy>);
}

export default Menu;