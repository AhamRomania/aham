import * as React from "react"
import LargeHeader from "../LargeHeader";
import Footer from "../Footer";
import { Centred } from "./common";
import getConfig from "next/config";
import Referrer from "../Widget/Referrer";
import Gdpr from "../Dialog/Gdpr";

const HomepageLayout = ({children}: React.PropsWithChildren) => {

    const { publicRuntimeConfig } = getConfig();

    return (
        <main>
            <LargeHeader />
            <Centred mode="column">
                {children}
            </Centred>
            <Footer version={publicRuntimeConfig.version}/>
            <Referrer/>
            <Gdpr/>
        </main>
    )
}

export default HomepageLayout