"use client";

import { FC } from 'react';
import styles from './style.module.css';

type HeadMenuProps = object;

const HeadMenu: FC<HeadMenuProps> = ({}) => {

    return (
        <div className={styles.headMenu}>
            <button className={styles.headMenuButtonMore}>
                <svg xmlns="http://www.w3.org/2000/svg" width={11} height={7}>
                    <path
                    fill="#E8EAED"
                    fillRule="nonzero"
                    d="M5.5 7 0 1.706 1.772 0 5.5 3.588 9.228 0 11 1.706z"
                    />
                </svg>
                <label>Meniu</label>
            </button>
        </div>
    )
}

export default HeadMenu