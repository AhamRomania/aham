import * as React from "react"
import Header from "../Header";
import Footer from "../Footer";
import { Centred } from "./common";
import getConfig from "next/config";

const MainLayout = ({children}: React.PropsWithChildren) => {

    const { publicRuntimeConfig } = getConfig();

    return (
        <main>
            <Header />
            <Centred>
                {children}
            </Centred>
            <Footer version={publicRuntimeConfig.version}/>
        </main>
    )
}

export default MainLayout