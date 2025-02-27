import getApiFetch from "@/api/api";
import { FC, useState, PropsWithChildren, useEffect } from "react";

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

    const api = getApiFetch();
    const [ok, setOK] = useState(false);

    useEffect(() => {
        api(`/sam/${resource}/${permission}`,{success: true}).then(
            () => setOK(true),
        ).then(
            () => setOK(false),
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