import * as React from "react"
import LargeHeader from "../LargeHeader";

const HomepageLayout = ({children}: React.PropsWithChildren) => {

    return (
        <div>
            <LargeHeader />
            <div style={{margin:'0 auto', width: 1024}}>
                {children}
            </div>
        </div>
    )
}

export default HomepageLayout