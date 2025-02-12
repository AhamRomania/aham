"use client";

import getApiFetch from "@/api/api";
import DPropDialog from "@/c/Dialog/DProp";
import { AccountLayoutContext } from "@/c/Layout/account";
import DProps from "@/c/Tables/DProps";
import { Prop } from "@/c/types";
import { Add } from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const api = getApiFetch();
  const [props,setProps] = useState<Prop[]>([]);
  const { setPath } = useContext(AccountLayoutContext);
  const [prop, setProp] = useState<Prop|any>();

  useEffect(() => {
    setPath(
      <>
        <span>Proprietăți dinamice</span>
        <IconButton onClick={() => setProp({})}>
          <Add />
        </IconButton>
      </>
    );
    onPropsChange();
  }, []);

  const onPropsChange = () => {
    api<Prop[]>(`/props`).then(setProps);
  }

  const onCreateComplete = () => {
    setProp(undefined);
    onPropsChange();
  }

  return (
    <>
      <DProps props={props} onChange={onPropsChange} />
      {prop && <DPropDialog onClose={() => onCreateComplete()}/>}
    </>
  );
}
