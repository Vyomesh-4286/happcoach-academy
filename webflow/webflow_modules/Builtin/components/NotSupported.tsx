"use client";
import * as React from "react";
import type { Props } from "../../types";

const NotSupported = React.forwardRef<
  HTMLDivElement,
  Props<"div", { _atom?: string }>
>(function NotSupported({ _atom = "" }, ref) {
  return (
    <div ref={ref}>{`This builtin is not currently supported: ${_atom}`}</div>
  );
});

export default NotSupported;
