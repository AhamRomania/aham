import { Autocomplete } from "@mui/joy";
import { FC, useEffect, useState } from "react";
import { Prop } from "../types";
import getApiFetch from "@/api/api";

export interface AutocompletePropProps {
    prop: Prop
    endDecorator: React.ReactNode
}

const AutocompletePropValue:FC<AutocompletePropProps> = ({prop, endDecorator}) => {
    const api = getApiFetch();
    const [options, setOptions] = useState<string[]>([]);
    
    useEffect(() => {
        api<string[]>(`/props/${prop.id}/values`).then(setOptions);
    }, [prop])

    return (
        <Autocomplete
            freeSolo
            endDecorator={endDecorator}
            name={`prop[${prop.name}]`}
            options={options}
        />
    )
}

export default AutocompletePropValue;