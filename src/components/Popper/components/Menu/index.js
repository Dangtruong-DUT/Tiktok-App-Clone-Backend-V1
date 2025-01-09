import Tippy from '@tippyjs/react/headless';
import classNames from "classnames/bind";
import Styles from './Menu.module.scss'
import { PopperWrapper } from "@/components/Popper";
import MenuItem from './MenuItem';

const cx = classNames.bind(Styles);

function Menu({ children , items=[]}) {
    const renderItems = () => {
        return items.map((item, index) => {
            return (
                <MenuItem  key={index} className={cx('item')} data={item}/>
            )
        });
    };
    return (
        <Tippy
        delay={[30,500]}
            interactive
            placement='bottom-end'
            render={(attrs) => {
                return (
                    <div className={cx('menu-items')} tabIndex={-1} {...attrs}>
                        <PopperWrapper >
                            {renderItems()}
                        </PopperWrapper>
                    </div>
                )
            }}
        >
            {children}
        </Tippy>);
}

export default Menu;