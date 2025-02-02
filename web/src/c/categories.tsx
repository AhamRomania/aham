"use client";

import { css } from "@emotion/react";
import Link from "next/link";
import { FC } from "react";

export type Category = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  children: Category[]
}

export interface CategoriesProps {
  categories: Category[];
}

export interface CategoryProps {
  category: Category;
}

export const Item: FC<CategoryProps> = ({ category }) => {
  return (
    <div
      css={css(`
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 20px;
            svg {
                margin-right: 15px;
            }
      `)}
    >
      <Icon color="#F2F2F2" />
      <Link href={`/${category.slug}`}>
        <span>{category.name}</span>
      </Link>
    </div>
  );
};

export const CategoryList: FC<CategoriesProps> = ({ categories }) => {
  return (
    <div
      css={css(`
            display: grid;
            @media only screen and (min-width : 1200px) {
                grid-template-columns: 1fr 1fr 1fr;
                gap: 0px 0px; 
                grid-template-areas: 
                    ". . .";
            }
        `)}
    >
      {(categories || []).map((c, i) => (
        <Item key={i} category={c} />
      ))}
    </div>
  );
};

interface IconProps {
  color: string;
}

export const Icon: FC<IconProps> = ({ color }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={42} height={42}>
      <g fill="none" fillRule="evenodd">
        <circle cx={21} cy={21} r={21} fill={color} />
        <path
          fill="gray"
          fillRule="nonzero"
          d="M23.216 21 17 14.867 18.892 13 27 21l-8.108 8L17 27.133z"
        />
      </g>
    </svg>
  );
};
