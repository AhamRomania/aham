"use client"

import { FC, useContext, useEffect, useState } from "react"
import { AccountLayoutContext } from "../Layout/account";
import { Button, DialogActions, DialogContent, FormControl, FormLabel, IconButton, Input, Snackbar, Stack, Table } from "@mui/joy";
import { Add, CheckCircle, Delete, Error } from "@mui/icons-material";
import getApiFetch from "@/api/api";
import { SeoEntry } from "../types";
import { Dialog, DialogTitle } from "@mui/material";
import {css} from '@emotion/react';
import { PageName } from "../Layout";

const SeoMap:FC = () => {

    const api = getApiFetch();
    const [seoMap, setSeoMap] = useState<SeoEntry[]>([]);
    const [showSavedSnack, setShowSavedSnack] = useState<boolean>(false);
    const [showErrorSnack, setShowErrorSnack] = useState<boolean>(false);
    const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
    const [newPath, setNewPath] = useState<string>('');

    const { setPath } = useContext(AccountLayoutContext);

    useEffect(() => {
        update();
    }, []);

    useEffect(() => {
        setPath(
        <>
            <span>Admin</span>
            <span>SEO</span>
        </>
        );
    }, []);

    const update = () => {
        api<SeoEntry[]>(`/seo`).then(setSeoMap);
    }

    const create = () => {
        api(`/seo`,{method:'POST',body:JSON.stringify({uri: newPath}), success:true}).then(
            () => {
                setShowSavedSnack(true);
                setShowAddDialog(false);
                setNewPath('');
                update();
            },
        ).catch(
            () => {
                setShowErrorSnack(true);
                setShowAddDialog(false);
            }
        )
    }

    const save = (item: SeoEntry, index: number) => {
        api<SeoEntry>(`/seo/${item.id}`,{method:'PUT',body:JSON.stringify(item)}).then(
            (entry) => {
                setShowSavedSnack(true);
                const copy = [...seoMap]
                copy[index] = entry;
                setSeoMap(copy);    
            },
        ).catch(
            () => {
                setShowErrorSnack(true);
            }
        )
    }

    const remove = (item: SeoEntry) => {
        if (confirm('Ștergi elementul seo?')) {
            api(`/seo/${item.id}`,{method:'delete', success:true}).then(
                () => {
                    setShowSavedSnack(true);
                    update();
                },
            ).catch(
                () => {
                    setShowErrorSnack(true);
                }
            )
        }
    }

    return (
        <div>
            <PageName
                right={(
                    <IconButton onClick={() => setShowAddDialog(true)} size="sm">
                        <Add />
                    </IconButton>
                )}
            >SEO</PageName>
            <Table>
                <thead>
                    <tr>
                        <th style={{ width: '4%' }}>ID</th>
                        <th style={{ width: '15%' }}>URI</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th style={{ width: '40px' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {seoMap.map((item, index) => (
                        <tr key={index}>
                            <td>
                                {item.id}
                            </td>
                            <td>
                                {item.uri}
                            </td>
                            <td>
                                <Input
                                    size="sm"
                                    defaultValue={item.title}
                                    onChange={(e) => {
                                        item.title = e.target.value;
                                    }}
                                    onBlur={() => save(item, index)}
                                />
                            </td>
                            <td>
                                <Input
                                    size="sm"
                                    defaultValue={item.description}
                                    onChange={(e) => {
                                        item.description = e.target.value;
                                    }}
                                    onBlur={() => save(item, index)}
                                />
                            </td>
                            <td>
                                <Stack direction="row" gap={1}>
                                    <IconButton
                                        size="sm"
                                        variant="soft"
                                        onClick={() => remove(item)}
                                    >
                                        <Delete color="error"/>
                                    </IconButton>
                                </Stack>
                            </td>
                        </tr>))}
                </tbody>
            </Table>
            <Snackbar
                variant="outlined"
                anchorOrigin={{vertical:'top', horizontal:'center'}}
                open={showSavedSnack}
                autoHideDuration={3000}
                onClose={() => setShowSavedSnack(false)}
            >
                <CheckCircle color="success"/>
                Datele au fost salvate!
            </Snackbar>
            <Snackbar
                variant="outlined"
                anchorOrigin={{vertical:'top', horizontal:'center'}}
                open={showErrorSnack}
                autoHideDuration={3000}
                onClose={() => setShowErrorSnack(false)}
            >
                <Error color="error"/>
                Datele nu au fost salvate!
            </Snackbar>
            <Dialog
                open={showAddDialog}
                onClose={() => setShowAddDialog(false)}
            >
                <DialogTitle>Adaugă element SEO</DialogTitle>
                <DialogContent>
                    <div
                        css={css`
                            padding: 20px;
                        `}
                    >
                    <FormControl>
                        <FormLabel>Path</FormLabel>
                        <Input
                            defaultValue={newPath}
                            onChange={(e:any) => setNewPath(e.target.value)}
                        />
                    </FormControl>
                    </div>
                </DialogContent>
                <DialogActions>
                    <div
                        css={css`
                            padding: 20px;
                        `}
                    >
                        <Button onClick={() => create()}>Crează</Button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default SeoMap;