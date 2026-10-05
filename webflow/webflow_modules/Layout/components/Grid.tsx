"use client";
import * as React from "react";
import type { TagProps } from "../../types";

const Grid = React.forwardRef<HTMLElement, TagProps>(function Grid(
  { tag = "div", className = "", grid: _grid, ...props },
  ref
) {
  return React.createElement(tag, {
    className: className + " w-layout-grid",
    ...props,
    ref,
  });
});

export default Grid;
