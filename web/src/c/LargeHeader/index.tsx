import { FC } from "react";
import getConfig from "next/config";

import styles from "./style.module.css";
import SearchInput from "../SearchInput";
import Logo from "../logo";
import HeadMenu from "../HeadMenu";
import { getLoggedInState } from "@/c/Auth";
import Link from "next/link";
import Tip from "../tooltip";

const LargeHeader: FC = async () => {
  const { publicRuntimeConfig } = getConfig();
  const isLoggedIn = await getLoggedInState();

  return (
    <header className={styles.header}>
      <div style={{ paddingTop: 25 }} className={styles.wrapper}>

        <div className={styles.actual}>
          <Tip title="Navighează la pagina principală">
            <Link href="/">
                <Logo size={60} padding={17} bg="#9c27b0" color="#FFF" />
            </Link>
          </Tip>
          <div style={{ flex: 1 }}></div>
          <HeadMenu isLoggedIn={isLoggedIn} />
        </div>

        <div className={styles.messages}>
          <h1>Bazarul tău</h1>
          <h2>
            Începe explorarea în bazarul tău preferat unde găsești și cunoști o
            grămadă de lucruri.
          </h2>
        </div>

        <div className={styles.searchWrapper}>
          <SearchInput
            placeholder={publicRuntimeConfig.searchDefaultPlaceholder}
          />
        </div>
      </div>
    </header>
  );
};

export default LargeHeader;
