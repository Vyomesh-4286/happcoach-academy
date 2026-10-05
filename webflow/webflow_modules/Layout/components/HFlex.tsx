"use client";
import * as React from "react";
import type { TagProps } from "../../types";

const HFlex = React.forwardRef<HTMLElement, TagProps>(function HFlex(
  { tag = "div", className = "", grid: _grid, ...props },
  ref
) {
  return React.createElement(tag, {
    className: className + " w-layout-hflex",
    ...props,
    ref,
  });
});

export default HFlex;
