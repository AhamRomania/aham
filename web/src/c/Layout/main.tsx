import * as React from "react"
import Header from "../Header";

const MainLayout = ({children}: React.PropsWithChildren) => {

    return (
        <div>
            <Header />
            <div style={{margin:'0 auto', width: 1024}}>
                {children}
            </div>
        </div>
    )
}

export default MainLayout