import { fetchCategories } from "@/api/categories";
import { css } from "@emotion/react";
import { ArrowLeft, Check, Close, KeyboardArrowRightOutlined } from "@mui/icons-material";
import { CircularProgress, FormControl, FormLabel, IconButton, Input, List, ListItem, ListItemButton, ListItemContent } from "@mui/joy";
import Image from "next/image";
import { FC, ReactNode, useEffect, useState } from "react";
import { Category } from "../types";
import { CategoryTreeNode, categoryTreeRootFromArray } from "./core";

const icon:{[key: number]: string} = {
    1: 'cars.svg',
    2: 'sell.svg',
    3: 'property.svg',
    4: 'jobs.svg',
    5: 'services.svg',
    6: 'communities.svg',
    7: 'pets.svg',
}

export interface CategorySelectorProps {
    name: string;
    mode: 'columns' | 'overlay';
    onCategorySelect: (category: Category | null) => void;
}

const CategorySelector: FC<CategorySelectorProps> = ({name, mode = 'columns', onCategorySelect}) => {
    // keyword on pending interaction to select one category
    const [keyword, setKeyword] = useState('');
    // the main tree of categories
    const [tree, setTree] = useState<CategoryTreeNode|null>(null); // root is selected category
    // current branch selection, if no children is a leaf and apply category
    const [branch, setBranch] = useState<CategoryTreeNode|null>(null); // top items selected item
    // search results on keyword change
    const [hintResults, setHintResults] = useState<CategoryTreeNode[]>([]);

    useEffect(() => {
        fetchCategories().then(a => setTree(categoryTreeRootFromArray(a)))
    },[])

    useEffect(() => {
        setKeyword(branch?.path.map(b => b.name).join(' / ') as string);
        if (branch && branch.children.length === 0) {
            onCategorySelect(branch.category)
        }
    }, [branch]);

    const renderSubcategoryList = (column: number): React.ReactNode => {

        if (!branch) {
            return null;
        }

        const children = branch?.path[column].children.sort((a, b) => a.category.sort - b.category.sort);

        const afterIcon = (node: CategoryTreeNode): ReactNode => {
            if (!branch.contains(node)) {
                return null;
            }
            return (!node.children || node.children.length == 0) ? <Check/> : <KeyboardArrowRightOutlined/>;
        }

        return (
            <List>
                {children.map((node) => (
                    <ListItem
                        style={{
                            borderBottom: "1px solid #ddd",
                            fontWeight: branch.contains(node) ? "bold" : "normal",
                        }}
                        onClick={() => setBranch(node)}
                        key={node.id}
                    >
                        <ListItemButton>
                            {node.name}
                            {node.children && node.children.length > 0 && <span style={{color: "#999"}}>({node.children.length})</span>}
                            {afterIcon(node)}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        );
    };

    const determineColumnLength = (): number[] => {

        let n = 0;

        if (branch) {
            if (branch.children && branch.children.length) {
                n = branch.path.length;
            } else {
                n = branch.path.length - 1;
            }
        }

        return [...Array(n).keys()]
    }

    const onKeywordChange = (e: any) => {
        const keyword = e.target.value
        setKeyword(keyword);
        if (tree && keyword != '' && keyword.length > 2) {
            const results = tree!.search(keyword);
            if (results && results.length) {
                setHintResults(results);
            }
        } else {
            setHintResults([]);
        }
    }

    const onSearchResultSelect = (node: CategoryTreeNode) => {
        applyCategoryFromNode(node);
    }

    const destroySelectedSearchResult = () => {
        applyCategoryFromNode(null);
    }

    const applyCategoryFromNode = (node: CategoryTreeNode | null) => {

        setBranch(node);

        if (!node) {
            setKeyword('');
            return;
        }

        setKeyword(node.path.map(i=>i.name).join(' / '));
        setHintResults([]);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const back = (from: number) => {
        if (branch?.parent) {
            setBranch(branch?.parent);
        }
    }

    if (tree == null) {
        return (
            <div
                css={css`
                    padding: 20px;
                    border: 1px solid #CDD7E1;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                `}
            >
                <CircularProgress thickness={2} size="sm"/>
                <span>Construim selectorul de categorii...</span>
            </div>
        )
    }

    return (
        <div data-testid="category-selector">
            <div
                css={css`
                    padding: 20px;
                    border: 1px solid #CDD7E1;
                    border-radius: 10px;
                `}
            >
                <div
                    css={css`
                        margin-bottom: 20px;    
                    `}
                >
                    <FormControl>
                        <FormLabel>Caută</FormLabel>
                        <Input
                            size="lg"
                            value={keyword}
                            onChange={onKeywordChange}
                            endDecorator={branch ? <IconButton onClick={destroySelectedSearchResult}><Close/></IconButton> : null}
                        />
                    </FormControl>
                    {hintResults && hintResults.length > 0 &&<List>
                        {hintResults?.map(result => <ListItem key={result.id}>
                            <ListItemButton onClick={() => onSearchResultSelect(result)}>
                                <ListItemContent>{result.path.map(i=>i.name).join(' / ')}</ListItemContent>
                            </ListItemButton>
                        </ListItem>)}
                    </List>}
                </div>
                <div
                    data-testid="category-toplevel"
                    css={css`
                        border-bottom: 1px solid #CDD7E1;
                        border-top: 1px solid #CDD7E1;
                        padding-bottom: 20px;
                        padding-top: 20px;
                        white-space: nowrap;
                        overflow-x: auto;
                        @media only screen and (min-width : 1200px) {
                            text-align: center;
                        }
                    `}
                >
                    {tree && tree?.children.map((node, index) => (
                        <div
                            key={index}
                            css={css`
                                display: inline-block;
                                margin-right: 10px;
                                justify-content:center;
                                flex-direction: column;
                                background: ${branch?.contains(node) ? '#eee' : 'transparent'};
                                border: ${branch?.contains(node) ? '1px solid #000' : '1px solid #eee'};
                                align-items: center;  
                                border-radius: 10px;
                                padding: 10px 15px;
                                cursor: pointer;
                                font-size: 16px;

                                &:last-child {
                                    margin-right: 0px;
                                }
                                
                                &:hover{
                                    background:#eee;
                                }
                                
                                span {
                                    margin-top: 5px;
                                }
                                
                                &.selected {
                                    background:#eee;
                                }
                            `}
                            onClick={() => setBranch(node)}
                        >
                            <div
                                css={css`
                                    display: flex;
                                    align-items: center;
                                    justify-content:center;
                                    flex-direction: column;    
                                `}
                            >
                                <Image width={20} height={20} src={'/categories/'+icon[node.id]} alt=""/>
                                <span>{node.name}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    css={css`
                        padding: 20px;
                        display: grid;
                        overflow-x: auto;
                        position: relative;
                        height: ${mode === 'columns' ? 'auto' : '400px'};
                        grid-template-columns: ${mode === 'columns' ? determineColumnLength().map(() => '1fr').join(' ') : 'auto'};
                    `}
                >
                    {(determineColumnLength().map((index) => (
                        <div
                            key={`tree-level-${index}`}
                            data-testid="category-tree-levels"
                            data-deepth-level={index + 1}
                            css={css`
                                padding: 20px;
                                position: ${mode === 'columns' ? 'relative' : 'absolute'};
                                text-align: center;
                                border-right: ${mode === 'columns' ? '1px solid #CDD7E1' : 'none'};
                                overflow-y: auto;
                                background: #FFF;
                                left: 0;
                                top: 0;
                                right: 0;
                                bottom: 0;
                                height: 400px;
                                display: flex;
                                    flex-direction: row;
                                &:last-child {
                                    border-right: none;
                                }
                            `}
                        >
                            {mode == 'overlay' && <div
                                css={css`
                                    height: 100%;
                                    display: flex;
                                    align-items: center;
                                    margin-right: 40px;
                                `}
                            >
                                {<IconButton onClick={() => back(index)} variant="solid"><ArrowLeft/></IconButton>}
                            </div>}
                            {renderSubcategoryList(index)}
                        </div>
                    )))}
                </div>
            </div>
            <input type="hidden" name={name} value={branch?.children.length === 0 ? branch?.id : ''}/>
        </div>
    )
}

export default CategorySelector;
