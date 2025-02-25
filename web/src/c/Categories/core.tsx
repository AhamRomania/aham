import { unaccent } from "../funcs";
import { Category } from "../types";

export class CategoryTreeNode {
    
    category: Category;
    parent: CategoryTreeNode | null;
    children: CategoryTreeNode[];
    saving: boolean;

    constructor(category: Category, parent: CategoryTreeNode | null = null) {
        this.category = category;
        this.parent = parent;
        this.saving = false;
        this.children = this.category.children?.map(item => new CategoryTreeNode(item, this)) || [];
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

    get path(): CategoryTreeNode[] {

        let items = [];

        items.push(this);

        let parent = this.parent;

        while (parent) {
            items.push(parent);
            parent = parent.parent
        }

        items = items.reverse();

        items.shift();

        return items;
    }

    get root(): CategoryTreeNode {

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

    findByID(id: number): CategoryTreeNode | null {
        
        if (id === -1) {
            return this.root;
        }
    
        if (!this.children || this.children.length === 0) {
            return null;
        }
    
        for (let i = 0; i < this.children.length; i++) {
            
            if (this.children[i].id === id) {
                return this.children[i];
            }
    
            // Recursive call to search in child nodes
            const foundNode = this.children[i].findByID(id);

            if (foundNode) {
                return foundNode; // Return only if a node is found
            }
        }
    
        return null; // Return null if no node is found
    }

    search(keyword: string): CategoryTreeNode[] {
        let results = searchRecursive(keyword, this.children);
        results = results.sort((a, b) => {
            return b.path.length - a.path.length;
        });
        return results;
    }

    create() {
        this.children.push(
            new CategoryTreeNode({} as Category, this)
        )
    }
}

function searchRecursive(keyword: string, nodes: CategoryTreeNode[]): CategoryTreeNode[] {
    
    let result: CategoryTreeNode[] = [];

    for (const node of nodes) {
        if (unaccent(node.name).toLowerCase().includes(keyword.toLowerCase())) {
            result.push(node);
        }

        if (node.children.length > 0) {
            result = result.concat(searchRecursive(keyword, node.children));
        }
    }

    return result;
}

export function categoryTreeRootFromArray(children:Category[]): CategoryTreeNode {
    return new CategoryTreeNode({id:0, name:'root', children} as Category,  null);
}