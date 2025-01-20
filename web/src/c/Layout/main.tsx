import * as React from "react"
import Header from "../Header";
import Footer from "../Footer";

const MainLayout = ({children}: React.PropsWithChildren) => {

    return (
        <div>
            <Header />
            <div style={{margin:'0 auto', width: 1024}}>
                {children}
            </div>
            <Footer/>
        </div>
    )
}

export default MainLayout