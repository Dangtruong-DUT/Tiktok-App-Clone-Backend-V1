import { memo, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { useDebounce } from '@/hooks';
import AccountItem from '@/components/AccountItem';
import Styles from './SearchBar.module.scss'
import * as searchService from '@/services/searchService'
import {
    ClearIcon,
    SpinnerIcon
} from '@/components/Icons';
import { DrawerSidebarHeader } from '../DrawerSidebarHeader';
const cx = classNames.bind(Styles);

function Search({ onClose, setSearchValue, searchValue }) {
    const [searchResults, setSearchResults] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const debounceValue = useDebounce(searchValue, 500);


    const inputRef = useRef();
    useEffect(() => {
        if (debounceValue.trim()) {
            const fetchApi = async () => {
                setShowLoading(true);
                const results = await searchService.search(debounceValue);
                setSearchResults(results);
                setShowLoading(false);
            }
            fetchApi();
        } else {
            setSearchResults([]);
        }

    }, [debounceValue]);

    const handleChangeInputValue = (event) => {
        const searchValue = event.target.value;
        if (searchValue.startsWith(' ')) {
            return;
        }
        setSearchValue(searchValue);
    }

    const handleClickAccountItem = () => {
        onClose();
    };

    return (
        <div className={cx('search-wrapper')}>
            <DrawerSidebarHeader title='Search' onExit={onClose} />
            <div className={cx('search')}>
                <input ref={inputRef} className={cx('search__input')}
                    type="text"
                    placeholder="Search"
                    spellCheck='false'
                    value={searchValue}
                    onChange={handleChangeInputValue}
                />
                {
                    !showLoading && !!searchValue.length &&
                    <div className={cx('search__icon-clear')}
                        onClick={() => {
                            setSearchValue('');
                            setSearchResults([]);
                            inputRef.current.focus();
                        }}
                    >
                        <ClearIcon width='16' height='16' />
                    </div>
                }
                {showLoading && <div className={cx('search__icon-spinner')} >
                    <SpinnerIcon width='24' />
                </div>}
            </div>
            <div className={cx('search-results')}>
                {
                    searchResults.length > 0 && (
                        <>
                            <h4 className={cx('search-title')}>Account</h4>
                            <ul tabIndex={-1}>
                                {searchResults.map((result, index) =>
                                    <li key={index}>
                                        <AccountItem
                                            key={result.id}
                                            avatarSize='40px'
                                            avatar={result.avatar}
                                            username={result.nickname}
                                            nameAccount={result.full_name}
                                            verified={result.tick}
                                            onClick ={handleClickAccountItem}
                                        />
                                    </li>
                                )}
                            </ul>
                        </>
                    )
                }

            </div>
        </div >
    );
}

export default memo(Search);