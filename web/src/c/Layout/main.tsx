import * as React from "react"
import Header from "../Header";
import Footer from "../Footer";
import { Centred } from "./common";

const MainLayout = ({children}: React.PropsWithChildren) => {

    return (
        <div>
            <Header />
            <Centred>
                {children}
            </Centred>
            <Footer/>
        </div>
    )
}

export default MainLayout