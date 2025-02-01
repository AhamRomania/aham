"use client";

import { Category } from "@/c";
import Tip from "@/c/tooltip";
import useApiFetch from "@/hooks/api";
import { Add, Delete, Edit, Home, Preview } from "@mui/icons-material";
import { Button, IconButton, Stack, Table } from "@mui/joy";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({params}) {

    const [categories, setCategories] = useState<Category[]>([]);
    const api = useApiFetch();
    const [id, setID] = useState(0)

    params.then(
        (d:any) => {
            if (d.id) {
                setID(d.id);
            }
        }
    )

    const update = () => {
        api<Category[]>('/categories?tree=true&p=' + id).then(
            (response) => {
                setCategories(response);
            }
        )
    }

    const removeCategory = (id: number) => {
        if(confirm("Ștergi categoria?")) {
            api<Category[]>('/categories/' + id, {method:'DELETE', success:true}).then(
                () => {
                    update();
                }
            )
        }
    };

    useEffect(() => update(),[id]);

    return (
        <>
            <Stack direction="row" gap={1}>
                <Link href={{pathname: `/u/categorii`}}>
                    <Tip title="Către categoriile principale"><IconButton variant="soft"><Home/></IconButton></Tip>
                </Link>
                <Link href={{pathname: `/u/categorii/creaza`, query:{"p": id}}}>
                    <Tip title="Adaugă subcategorii"><IconButton variant="soft"><Add/></IconButton></Tip>
                </Link>
            </Stack>
            <Table>
                <thead>
                    <tr>
                        <th style={{ width: '35%' }}>Nume</th>
                        <th style={{ width: '35%' }}>Slug</th>
                        <th style={{ width: '15%' }}>Subcategorii</th>
                        <th style={{ width: '20%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category,index) => <tr key={index}>
                        <td>{category.name}</td>
                        <td>
                            {category.slug}
                        </td>
                        <td>{category.children && category.children.length}</td>
                        <td>
                            <Stack direction="row" gap={1}>
                                {category.children && <Link href={`/u/categorii/${category.id}`}>
                                    <Tip title="Vizualizează Subcategorii"><IconButton variant="soft"><Preview/></IconButton></Tip>
                                </Link>}
                                <Link href={{pathname: `/u/categorii/creaza`, query:{"p": category.id}}}>
                                    <Tip title="Adaugă subcategorii"><IconButton variant="soft"><Add/></IconButton></Tip>
                                </Link>
                                <Tip title="Editează"><IconButton variant="soft"><Edit/></IconButton></Tip>
                                <Tip title="Șterge"><IconButton onClick={() => removeCategory(category.id)} variant="soft"><Delete/></IconButton></Tip>
                            </Stack>
                        </td>
                    </tr>)}
                </tbody>
            </Table>
        </>
    )
}
  