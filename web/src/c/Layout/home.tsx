import * as React from "react"
import LargeHeader from "../LargeHeader";
import Footer from "../Footer";
import { Centred } from "./common";

const HomepageLayout = ({children}: React.PropsWithChildren) => {

    return (
        <main>
            <LargeHeader />
            <Centred mode="column">
                {children}
            </Centred>
            <Footer/>
        </main>
    )
}

export default HomepageLayout