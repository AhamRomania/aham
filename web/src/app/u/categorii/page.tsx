import { Category } from "@/c";
import Tip from "@/c/tooltip";
import useApiFetch from "@/hooks/api";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Button, IconButton, Stack, Table } from "@mui/joy";

export default async function Page() {

    const api = useApiFetch();
    const categories = await api<Category[]>('/categories');

    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th style={{ width: '40%' }}>Nume Categorie</th>
                        <th>Subcategorii</th>
                        <th>Anunturi</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(c => <tr>
                        <td>{c.name}</td>
                        <td>159</td>
                        <td>6</td>
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
  