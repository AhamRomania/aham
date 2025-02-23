import * as React from "react"
import LargeHeader from "../LargeHeader";
import Footer from "../Footer";
import { Centred } from "./common";
import getConfig from "next/config";
import Referrer from "../Widget/Referrer";

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
        </main>
    )
}

export default HomepageLayout