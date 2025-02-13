import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Stack, Table } from "@mui/joy";
import { FC, useState } from "react";
import { Prop } from "../types";
import DPropDialog from "../Dialog/DProp";
import getApiFetch from "@/api/api";

interface DPropsProps {
    props: Prop[];
    onChange: () => void;
}

const DProps:FC<DPropsProps> = ({props:rows,onChange}) => {

    const api = getApiFetch();
    const [edit,setEdit] = useState<Prop>();

    const remove = (row: Prop) => {
        if(confirm('Ștergi proprietatea dinamică?')) {
            api(`/props/${row.id}`,{method:'DELETE', success: true}).then(
                () => {
                    if(onChange) { onChange() }
                }
            ).catch(
                () => {
                    alert('nu am putut șterge');
                }
            )
        }
    }

    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th style={{width:'3%'}}>ID</th>
                        <th>Titlu</th>
                        <th>Nume</th>
                        <th>Type</th>
                        <th>Options</th>
                        <th>Grup</th>
                        <th>Template</th>
                        <th>Description</th>
                        <th>Sort</th>
                        <th style={{width:'7%'}}></th>
                    </tr>
                </thead>
                <tbody>
                    {(rows||[]).map((row) => (
                    <tr key={row.name}>
                        <td>{row.id}</td>
                        <td>{row.title}</td>
                        <td>{row.name}</td>
                        <td>{row.type}</td>
                        <td>
                            {(row.options && row.options.values)?row.options.values[0]+'...':''}
                        </td>
                        <td>{row.group}</td>
                        <td>{row.template}</td>
                        <td>{row.description}</td>
                        <td>{row.sort}</td>
                        <td>
                            <Stack flexDirection="row" gap={1}>
                                <IconButton onClick={() => setEdit(row)} variant="soft" size="sm">
                                    <Edit/>
                                </IconButton>
                                <IconButton onClick={() => remove(row)} variant="soft" size="sm">
                                    <Delete color="error"/>
                                </IconButton>
                            </Stack>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </Table>

            {edit && <DPropDialog prop={edit} onClose={() => setEdit(undefined)}/>}
        </>
    )
}

export default DProps;