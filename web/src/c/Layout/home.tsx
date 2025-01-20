import * as React from "react"
import LargeHeader from "../LargeHeader";
import Footer from "../Footer";

const HomepageLayout = ({children}: React.PropsWithChildren) => {

    return (
        <div>
            <LargeHeader />
            <div style={{margin:'0 auto', width: 1024}}>
                {children}
            </div>
            <Footer/>
        </div>
    )
}

export default HomepageLayout