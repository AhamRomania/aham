"use client";

import { Category } from "@/c";
import Tip from "@/c/tooltip";
import useApiFetch from "@/hooks/api";
import { Add, ArrowRight, Delete, Edit, Home, Save } from "@mui/icons-material";
import { Button, CircularProgress, FormControl, FormHelperText, FormLabel, IconButton, Input, Stack, Table } from "@mui/joy";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";

type Item = Category

export default function Page() {

    const params = useSearchParams();

    const api = useApiFetch();
    const [category, setCategory] = useState<Category | null>(null);
    const [data, setData] = useState<Item[]>([{} as Item]);

    useEffect(() => {
        api<Category>('/categories/' + params.get('p')).then(
            response => {
                setCategory(response);
            }
        )
    }, []);

    const onItemRemove = (index: number) => {
        data.splice(index, 1)
        setData([...data]);
    }

    const onItemChange = (item: Category, index: number) => {
        data[index] = item ;
        setData([...data]);
    }

    const onCreateNew = (item: Category, index: number) => {
        setData([...data, {} as Item]);
    }

    return (
        <>
            <Stack direction="row" gap={1} alignItems="center">
                <Link href={{pathname: `/u/categorii`}}>
                    <Tip title="Către categoriile principale"><IconButton variant="soft"><Home/></IconButton></Tip>
                </Link>
                <div>
                    Părinte: {category ? category.name : '...'}
                </div>
            </Stack>
            
            <Table>
                <thead>
                    <tr>
                        <th style={{ width: '4%' }}>ID</th>
                        <th>Nume</th>
                        <th style={{ width: '5%' }}></th>
                        <th>Slug</th>
                        <th style={{ width: '15%' }}>Actiuni</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <RowItem
                            parent={category}
                            onDataChange={onItemChange}
                            onCreateNew={onCreateNew}
                            onItemRemove={onItemRemove}
                            index={index}
                            data={item}
                            key={index}
                        />))}
                </tbody>
            </Table>
        </>
    )
}

interface RowItemProps {
    index: number;
    parent: Category | null;
    data: Category
    onItemRemove: (index: number) => void;
    onDataChange: (data: Category, index: number) => void;
    onCreateNew: (item: Category, index: number) => void;
}

const RowItem: FC<RowItemProps> = ({index, parent, data, onItemRemove, onDataChange, onCreateNew}) => {

    const api = useApiFetch();
    const [loading, setLoading] = useState(false);
    const [vo, setVo] = useState(data);

    const onPropChange = (name: string, e: any) => {
        (vo as any)[name] = e.target.value;
        setVo(vo);
    }

    const create = () => {
        setLoading(true);

        if (parent) {
            vo.parent = parent.id;
        }

        api('/categories', {method:'POST', body: JSON.stringify(vo)}).then(
            (response) => {
                setLoading(false);
                setVo(response as Category);
                onDataChange && onDataChange(data, index);
            },
            (err) => {
                alert('Nu am putut adauga. UNIQUE(name,slug,parent)')
                setLoading(false)
            }
        )
    }

    const save = () => {
        
        if (!vo.name || vo.name == '') {
            alert('Numele este obligatoriu');
            return
        }

        if (!vo.id) {
            create();
            return;
        }

        setLoading(true);

        api('/categories/' + vo.id, {method:'PUT', body: JSON.stringify(vo)}).then(
            (response) => {
                setLoading(false);
                setVo(response as Category);
                onDataChange && onDataChange(data, index);
            },
            (err) => {
                alert(err)
                setLoading(false)
            }
        )
    }

    return (
        <tr key={index}>
            <td>
                {loading ? <CircularProgress size="sm"/> : (vo.id ? vo.id : '#')}
            </td>
            <td>
                <Input onBlur={() => save()} defaultValue={vo.name} value={vo.name} onChange={(e) => onPropChange('name', e)}/>
            </td>
            <td>
                <Tip title="Genereaza Slug"><IconButton onClick={() => {}} variant="soft"><ArrowRight/></IconButton></Tip>
            </td>
            <td>
                <Input disabled defaultValue={vo.slug} />
            </td>
            <td>
                <Stack direction="row" gap={1}>
                    <Tip title="Salvează"><IconButton onClick={() => save()} variant="soft"><Save/></IconButton></Tip>
                    <Tip title="Adaugă"><IconButton onClick={() => onCreateNew && onCreateNew()} variant="soft"><Add/></IconButton></Tip>
                    <Tip title="Șterge"><IconButton onClick={() => onItemRemove(index)} variant="soft"><Delete/></IconButton></Tip>
                </Stack>
            </td>
        </tr>
    )
}