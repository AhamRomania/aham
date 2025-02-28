import { checkPermission } from "@/api/common";
import { FC, PropsWithChildren, useEffect, useState } from "react";

export enum SamResource {
    CITIES = 1,
    CATEGORIES = 2,
    ADS = 3,
}

export enum SamPermission {
    READ = 1 << 0,
    WRITE = 1 << 1,
    PUBLISH = 1 << 2,
    DELETE = 1 << 3,
}

export interface SamProps {
    resource: SamResource;
    permission: SamPermission;
}

const Sam:FC<SamProps & PropsWithChildren> = ({resource, permission, children}) => {

    const [ok, setOK] = useState(false);

    useEffect(() => {
        checkPermission(resource, permission).then(
            () => setOK(true)
        );
    }, [resource, permission]);

    if (!ok) {
        return [];
    }

    return (
        <div>
            {children}
        </div>
    )
}

export default Sam;