import { FC } from 'react';
import getConfig from 'next/config';

import styles from './style.module.css';
import SearchInput from '../SearchInput';
import Logo from '../logo';
import HeadMenu from '../HeadMenu';

const LargeHeader: FC = () => {

    const {publicRuntimeConfig} = getConfig();

    return (
        <header className={styles.header}>
            <div style={{paddingTop: 25}} className={styles.wrapper}>
                
                <div className={styles.actual}>
                    <Logo size={60} padding={15} bg='#0C5BA1' color='#FFF'/>
                    <div style={{flex:1}}></div>
                    <HeadMenu/>
                </div>

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