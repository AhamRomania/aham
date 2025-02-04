import useApiFetch from "@/hooks/api";
import { FC, useEffect, useReducer, useState } from "react";
import { Category } from "../types";
import { css } from "@emotion/react";
import { Button } from "@mui/joy";
import { Check, KeyboardArrowRightOutlined } from "@mui/icons-material";
import Image from "next/image";

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
    onCategorySelect: (category: Category) => void;
}

const CategorySelector: FC<CategorySelectorProps> = ({onCategorySelect}) => {

    const api = useApiFetch();
    const [categories, setCategories] = useState<Category[]>([]); // top root childs
    const [selected, setSelected] = useState(-1); // top items selected item
    const [tree, setTree] = useState<Category>(); // root is selected category
    const [path, setPath] = useState<number[]>([]); // index 0 is from selected category children
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        api<Category[]>('/categories').then(
            (response) => {
                setCategories(response);
            }
        );
    },[])

    const setCurrentCategory = (index:number) => {
        setSelected(index);
        setTree(categories[index]);
        setPath([]);
        forceUpdate();
    }

    const nodeOfCurrentPath = (column: number) => {

        let node = tree;
    
        for (let i = 0; i < column; i++) {
            if (!node?.children || path.length <= i) {
                return undefined; // Ensure safe access and return undefined if out of bounds
            }
            node = node.children[path[i]]; // Traverse to the next level
        }
    
        return node;
    };

    const renderDeepthColumn = (column: number): React.ReactNode => {

        const columnCategory = nodeOfCurrentPath(column)

        if (!columnCategory || !columnCategory.children) {
            return [];
        }

        const columnCategories = sortListByName(columnCategory.children) || [];

        return columnCategories.map((node,index) => (
            <div onClick={() => selectTreeBranch(node, column, index)} key={node.id}>
                <Button
                    variant="plain"
                    endDecorator={path[column] == index ? (node.children ? <KeyboardArrowRightOutlined/> : <Check/>) : []}>
                    {node.name}
                </Button>
            </div>
        ));
    };

    const sortListByName = (list: Category[], ascending = true): Category[] => {
        
        if (!list || list.length == 0) {
            return [];
        }

        return list.sort((a, b) => 
            ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        );
    };

    const selectTreeBranch = (category: Category, level: number, index: number) => {
        
        if (!category.children) {
            onCategorySelect(category);
        }

        setPath([...path.slice(0, level), index]);
    };

    const determineColumnLength = (): number[] => {

        let n = 0;

        for (let i = 0; i < 5; i++) {
            if (nodeOfCurrentPath(i)?.children) {
                n++;
            }
        }

        return [...Array(n).keys()]
    }

    return (
        <div data-testid="category-selector">
            <div
                css={css`
                    margin-top: 50px;
                    padding: 20px;
                    border: 1px solid #eee;
                    border-radius: 10px;
                `}
            >
                <div
                    data-testid="category-toplevel"
                    css={css`
                        border-bottom: 1px solid #eee;
                        padding-bottom: 20px;
                        white-space: nowrap;
                        overflow-x: auto;
                        @media only screen and (min-width : 1200px) {
                            text-align: center;
                        }
                    `}
                >
                    {categories.map((c, index) => (
                        <div
                            key={index}
                            css={css`
                                display: inline-block;
                                margin-right: 10px;
                                justify-content:center;
                                flex-direction: column;  
                                border: 1px solid #eee;
                                background: ${selected == index ? '#eee' : 'transparent'};
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
                            onClick={() => setCurrentCategory(index)}
                        >
                            <div
                                css={css`
                                    display: flex;
                                    align-items: center;
                                    justify-content:center;
                                    flex-direction: column;    
                                `}
                            >
                                <Image width={20} height={20} src={'/categories/'+icon[c.id]} alt=""/>
                                <span>{c.name}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    css={css`
                        padding: 20px;
                        display: grid;
                        overflow-x: auto;
                        grid-template-columns: ${determineColumnLength().map(() => '1fr').join(' ')}
                    `}
                >
                    {(determineColumnLength().map((v, index) => (
                        <div
                            key={`tree-level-${index}`}
                            data-testid="category-tree-levels"
                            data-deepth-level={index + 1}
                            css={css`
                                padding: 20px;
                                text-align: center;
                                border-right: 1px solid #eee;
                                overflow-y: auto;
                                height: 400px;
                                &:last-child {
                                    border-right: none;
                                }
                            `}
                        >
                            {renderDeepthColumn(index)}
                        </div>
                    )))}
                </div>

            </div>
        </div>
    )
}

export default CategorySelector;