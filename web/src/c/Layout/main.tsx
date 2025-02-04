import * as React from "react"
import Header from "../Header";
import Footer from "../Footer";
import { Centred } from "./common";
import getConfig from "next/config";

const MainLayout = ({children}: React.PropsWithChildren) => {

    const config = getConfig()

    return (
        <main>
            <Header />
            <Centred>
                {children}
            </Centred>
            <Footer version={"0.1.0"}/>
        </main>
    )
}

export default MainLayout