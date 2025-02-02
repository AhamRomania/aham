import { Breadcrumbs, IconButton, Input, Stack, Table, Link as JoyLink, CircularProgress } from "@mui/joy";
import { ChangeEvent, FC, useEffect, useReducer, useState } from "react";
import { Category } from "../types";
import { Add, ArrowRight, Delete, Home, KeyboardDoubleArrowRight, Preview, Save } from "@mui/icons-material";
import Link from "next/link";
import Tip from "@/c/tooltip";
import useApiFetch from "@/hooks/api";

class Node {
    
    category: Category;
    parent: Node;
    children: Node[];
    saving: boolean;

    constructor(category: Category, parent: Node = null) {
        this.category = category;
        this.parent = parent;
        this.saving = false;
        this.children = this.category.children?.map(item => new Node(item, this)) || [];
    }

    get id() {
        return this.category.id || 0;
    }

    get name() {
        return this.category.name || '';
    }

    get slug() {
        return this.category.slug || '';
    }

    get path(): Node[] {

        const items = [];

        items.push(this);

        let parent = this.parent;

        while (parent) {
            items.push(parent);
            parent = parent.parent
        }

        return items.reverse();
    }

    get root(): Node {

        let node = this.parent;

        if (!node) {
            return this;
        }

        while (node.parent) {
            node = node.parent
        }
        return node;
    }

    remove(): Category | null {
        
        if (this.parent && this.parent.children) {
            const index = this.parent.children.indexOf(this)
            const clone = Object.assign({}, this.parent.children[index].category);
            this.parent.children.splice(index, 1);
            return clone
        }

        return null;
    }

    findByID(id: number): Node | null {

        if (id == -1) {
            return this.root
        }

        if (!this.children) {
            return null;
        }

        for(let i=0; i<this.children?.length; i++) {
            
            if (this.children[i].id === id) {
                return this.children[i];
            }

            return this.children[i].findByID(id)
        }

        return null;
    }

    create() {
        this.children.push(
            new Node({} as Category, this)
        )
    }
}

const CategoriesEditor:FC<ListEditProps> = ({parent}) => {
    
    const api = useApiFetch();

    const [root, setRoot] = useState<Node>();
    const [node, setNode] = useState<Node>();
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const save = () => {};

    const update = () => {
        api<Category[]>('/categories?tree=true').then(
            (categories) => {

                const root = new Node({
                    id: -1,
                    name: 'root',
                    slug: 'root',
                    children: categories,
                });

                setRoot(root);
                setNode(root);
            }
        )
    };

    const setNodeByCategoryID = (id: number) => {
        if (node) {
            const found = node.root.findByID(id);
            if (found) {
                setNode(found);
            }
        }
    }

    const createNewNodes = (n = 1) => {
        if (node) {
            
            for(let i=0; i < n; i++) {
                node.create();
            }

            forceUpdate();
        }
    }

    const deleteCurrentNode = (node: Node) => {

        let msg = 'Delete category?'

        if (node.name != "") {
            msg = `Delete ${node.name}?`
        }

        if (!node.id) {
            msg = `Delete newly added category?`
        }

        if (confirm(msg)) {
            const category = node.remove();
            if (category) {
                api<Category>(`/categories/${category?.id}`, {
                    method:'DELETE',
                    success: true,
                }).then(
                    ()=> {
                        forceUpdate();
                    }
                );
            }
        }
    }

    const saveCurrentNodeData = (item: Node) => {
        
        item.saving = true;
        
        forceUpdate();
        
        if (item.category.id) {

            api<Category>(`/categories/${item.category.id}`, {
                method:'PUT',
                body: JSON.stringify({
                    name: item.name,
                    slug: item.slug,
                    parent: item.parent.id
                })
            }).then(
                (response)=> {
                    item.saving = false;
                    item.category = response;
                    forceUpdate();
                }
            );

            return
        }

        api<Category>(`/categories`, {
            method:'POST',
            body: JSON.stringify({
                name: item.name,
                slug: item.slug,
                parent: node?.id
            })
        }).then(
            (response)=> {
                item.saving = false;
                item.category = response;
                forceUpdate();
            }
        );
    }

    const makeSlugFromName = (node: Node) => {
        node.category.slug = slugify(node.name);
        forceUpdate();
        saveCurrentNodeData(node);
    }

    useEffect(() => update(), []);

    return (
        <div>
            <Stack gap={1}>
                <Breadcrumbs separator="›" aria-label="breadcrumbs">
                    <Home onClick={() => window.location.href = '/'} style={{cursor: 'pointer'}} sx={{ mr: 0.5 }} />
                    {node?.path.map((node, index) => <JoyLink key={index} onClick={() => setNodeByCategoryID(node.id)}>
                        {node.name}
                    </JoyLink>)}
                    <Add onClick={() => createNewNodes()} style={{cursor: 'pointer'}} sx={{ mr: 0.5 }} />
                </Breadcrumbs>
            </Stack>
            <Table>
                <thead>
                    <tr>
                        <th style={{ width: '4%' }}>ID</th>
                        <th>Nume</th>
                        <th>Slug</th>
                        <th style={{ width: '4%' }}>#</th>
                        <th style={{ width: '15%' }}>Actiuni</th>
                    </tr>
                </thead>
                <tbody>
                    {((node||{}).children||[]).map((item, index) => (
                        <tr key={index}>
                            <td>
                                {!item.saving && (item.id || '#')}
                                {item.saving && <CircularProgress size="sm"/>}
                            </td>
                            <td>
                                <Input
                                    size="lg"
                                    value={item.name}
                                    onChange={(e) => {
                                        item.category.name = e.target.value;
                                        forceUpdate();
                                    }}
                                    onBlur={(e) => saveCurrentNodeData(item)}
                                />
                            </td>
                            <td>
                                <Input
                                    size="lg"
                                    startDecorator={<Tip title="Generează">
                                        <IconButton
                                            size="lg"
                                            variant="soft"
                                            onClick={() => makeSlugFromName(item)}
                                        >
                                            <KeyboardDoubleArrowRight/>
                                        </IconButton>
                                        </Tip>}
                                    value={item.slug}
                                    onChange={(e) => {
                                        item.category.slug = e.target.value
                                        forceUpdate();
                                    }}
                                    onBlur={() => saveCurrentNodeData(item)}
                                />
                            </td>
                            <td>
                                {item.children.length}
                            </td>
                            <td>
                                <Stack direction="row" gap={1}>
                                    {(item.children||[]) && <Tip title="Subcategorii">
                                        <IconButton
                                            size="lg"
                                            variant="soft"
                                            onClick={()=>setNode(item)}
                                        >
                                            <Preview/>
                                        </IconButton>
                                    </Tip>}
                                    <Tip title="Șterge">
                                        <IconButton
                                            size="lg"
                                            variant="soft"
                                            onClick={() => deleteCurrentNode(item)}
                                        >
                                            <Delete/>
                                        </IconButton>
                                    </Tip>
                                </Stack>
                            </td>
                        </tr>))}
                </tbody>
            </Table>
        </div>
    )
}

function slugify(str: string): string {
    return String(str)
      .normalize('NFKD') // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .trim() // trim leading or trailing whitespace
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-'); // remove consecutive hyphens
  }

export default CategoriesEditor;