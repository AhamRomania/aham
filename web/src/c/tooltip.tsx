"use client"

import * as React from "react";
import { Tooltip as JoyTooltip } from "@mui/joy";

export type TooltipProps = {
  title: string;
  delay?: number
};

const Tip = ({title, delay, children}: TooltipProps & React.PropsWithChildren) => {
  return (
    <JoyTooltip
      title={title}
      color="primary"
      enterDelay={delay || 2500}
      size="lg"
      variant="outlined"
    >
      <div>{children}</div>
    </JoyTooltip>
  );
};

export default Tip;
