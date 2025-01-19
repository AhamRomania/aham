import { FC } from 'react';
import Image from 'next/image';
import getConfig from 'next/config';

import styles from './style.module.css';
import SearchInput from '../SearchInput';

const LargeHeader: FC = () => {

    const {publicRuntimeConfig} = getConfig();

    return (
        <header className={styles.header}>
            <div style={{paddingTop: 25}} className={styles.wrapper}>
                
                <Image
                    priority
                    width={78}
                    height={76}
                    src="large-header-logo.svg"
                    alt="Large Header Logo"
                />

                <div className={styles.messages}>
                    <h1>Bazarul tău</h1>
                    <h2>Începe explorarea în bazarul tău preferat unde găsești și cunoști o grămadă de lucruri.</h2>
                </div>

                <div className={styles.searchWrapper}>
                    <SearchInput
                        placeholder={publicRuntimeConfig.searchDefaultPlaceholder}
                    />
                </div>
            </div>
        </header>
    )
}

export default LargeHeader