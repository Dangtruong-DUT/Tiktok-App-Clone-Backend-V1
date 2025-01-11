import { useEffect, useRef, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import { useDebounce } from '@/hooks';
import { PopperWrapper } from '@/components/Popper';
import AccountItem from '@/components/AccountItem';
import Styles from './Search.module.scss'
import * as searchService from '@/services/searchService'
import {
    ClearIcon, SearchIcon,
    SpinnerIcon
} from '@/components/Icons';
const cx = classNames.bind(Styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const debounceValue = useDebounce(searchValue, 500);

    const handleHideResults = () => {
        setShowResults(false);
    };

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
        setShowResults(true);
    }

    return (
        <div className={cx('search-wrapper')}>
            <Tippy
                visible={showResults && searchResults.length > 0}
                interactive={true}
                placement='bottom'
                onClickOutside={handleHideResults}
                offset={[0, 8]}
                render={(attr) => {
                    return (
                        <div className={cx('search-results')}>
                            <PopperWrapper >
                                <h4 className={cx('search-title')}>Account</h4>
                                <ul tabIndex={-1}>
                                    {searchResults.length > 0 && searchResults.map((result) =>
                                        <AccountItem
                                            key={result.id}
                                            avatarSize='40px'
                                            avatar={result.avatar}
                                            username={result.nickname}
                                            nameAccount={result.full_name}
                                            verified={result.tick}
                                        />
                                    )}
                                </ul>
                            </PopperWrapper>
                        </div>
                    )
                }}
            >
                <div className={cx('search')}>
                    <input ref={inputRef} className={cx('search__input')}
                        type="text"
                        placeholder="Search"
                        spellCheck='false'
                        value={searchValue}
                        onChange={handleChangeInputValue}
                        onFocus={() => {
                            setShowResults(true);
                        }}
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
                    <span className={cx('search__separate')} ></span>
                    <button className={cx('search__btn-submit')} type='submit'>
                        <SearchIcon width='24' height='24' />
                    </button>
                </div>
            </Tippy>
        </div>
    );
}

export default Search;