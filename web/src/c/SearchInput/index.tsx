"use client";

import { ChangeEventHandler, FC, useCallback, useState } from 'react';
import { sendGAEvent } from '@next/third-parties/google';
import styles from './style.module.css';

type SearchInputProps = {
    placeholder?: string
}

const SearchInput: FC<SearchInputProps> = ({placeholder}) => {

    const [disabled, setDisabled] = useState(true);

    const onKeywordChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        setDisabled(e.target.value.length < 2);
    }, []);

    return (
        <form action="cauta" className={styles.searchInput}>
            <input
                onChange={onKeywordChange}
                onFocus={() => sendGAEvent({ event: 'home:search', value: 'focus' })}
                type="text"
                name="ce"
                placeholder={placeholder}
            />
            <button
                disabled={disabled}
                onMouseDown={() => sendGAEvent({ event: 'home:search', value: 'submit' })}
                type="submit"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width={21} height={21}>
                    <path
                        fill="#837F7F"
                        fillRule="nonzero"
                        d="M8.375 0C3.745 0 0 3.66 0 8.183c0 4.525 3.745 8.184 8.375 8.184a8.462 8.462 0 0 0 4.48-1.279L18.907 21 21 18.954l-5.974-5.821c1.074-1.377 1.725-3.082 1.725-4.95C16.75 3.66 13.006 0 8.375 0Zm0 1.926c3.547 0 6.405 2.792 6.405 6.257 0 3.466-2.858 6.258-6.405 6.258-3.546 0-6.404-2.792-6.404-6.258 0-3.465 2.858-6.257 6.404-6.257Z"
                    />
                </svg>
            </button>
        </form>
    )
}

export default SearchInput