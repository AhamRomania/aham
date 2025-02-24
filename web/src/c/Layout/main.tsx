import * as React from "react"
import Header from "../Header";
import Footer from "../Footer";
import { Centred } from "./common";
import Gdpr from "../Dialog/Gdpr";

const MainLayout = ({children}: React.PropsWithChildren) => {

    return (
        <main>
            <Header />
            <Centred>
                {children}
            </Centred>
            <Footer version={"0.2.2"}/>
            <Gdpr/>
        </main>
    )
}

export default MainLayout