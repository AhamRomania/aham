import { Category } from "@/c";
import Tip from "@/c/tooltip";
import useApiFetch from "@/hooks/api";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Button, IconButton, Stack, Table } from "@mui/joy";

export default async function Page() {

    const api = useApiFetch();
    const categories = await api<Category[]>('/categories?tree=true');
    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th style={{ width: '70%' }}>Nume Categorie</th>
                        <th style={{ width: '15%' }}>Subcategorii</th>
                        <th style={{ width: '15%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(c => <tr>
                        <td>{c.name}</td>
                        <td>{c.children && c.children.length}</td>
                        <td>
                            <Stack direction="row" gap={1}>
                                <Tip title="Adaugă subcategorii"><IconButton variant="soft"><Add/></IconButton></Tip>
                                <Tip title="Editează"><IconButton variant="soft"><Edit/></IconButton></Tip>
                                <Tip title="Șterge"><IconButton variant="soft"><Delete/></IconButton></Tip>
                            </Stack>
                        </td>
                    </tr>)}
                </tbody>
            </Table>
        </>
    )
}
  