"use client"

import * as React from "react";
import { Tooltip as JoyTooltip } from "@mui/joy";

export type TooltipProps = {
  title: string;
};

const Tip = ({title, children}: TooltipProps & React.PropsWithChildren) => {
  return (
    <JoyTooltip
      title={title}
      color="primary"
      size="lg"
      variant="outlined"
    >
      <div>{children}</div>
    </JoyTooltip>
  );
};

export default Tip;
