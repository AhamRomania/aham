"use client";

import { css } from "@emotion/react";
import { FormControl, FormLabel, Input } from "@mui/joy";
import { FC } from "react";
export interface SearchParams {
  keyword: string;
}
const Search: FC<SearchParams> = ({ keyword }) => {
  return (
    <form
      method="get"
      css={css`
        margin-top: 30px;
      `}
    >
      <FormControl>
        <FormLabel>Cuvânt cheie</FormLabel>
        <Input size="lg" name="ce" defaultValue={keyword} />
      </FormControl>
    </form>
  );
};

export default Search;
