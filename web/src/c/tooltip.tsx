"use client"

import * as React from "react";
import { Tooltip as JoyTooltip } from "@mui/joy";

export type TooltipProps = {
  title: string;
};

const Tooltip = ({title, children}: TooltipProps & React.PropsWithChildren) => {
  return (
    <JoyTooltip
      title={title}
      color="primary"
      size="md"
      variant="soft"
    >{children}</JoyTooltip>
  );
};

export default Tooltip;
