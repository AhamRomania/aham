import * as React from "react"
import Header from "../Header";
import Footer from "../Footer";
import { Centred } from "./common";

const MainLayout = ({children}: React.PropsWithChildren) => {

    return (
        <main>
            <Header />
            <Centred>
                {children}
            </Centred>
            <Footer/>
        </main>
    )
}

export default MainLayout