"use client";
import * as React from "react";
import type { Props } from "../../types";

const Span = React.forwardRef<HTMLSpanElement, Props<"span">>(function Span(
  props,
  ref
) {
  return <span {...props} ref={ref} />;
});

export default Span;
