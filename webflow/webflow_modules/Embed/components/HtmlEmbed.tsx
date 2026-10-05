"use client";
import * as React from "react";
import * as utils from "../../utils";
import type { Props } from "../../types";

type HtmlEmbedProps = Props<
  "div",
  { tag?: React.ElementType; value?: string; content?: string }
>;

const HtmlEmbed = React.forwardRef<HTMLElement, HtmlEmbedProps>(
  function HtmlEmbed(
    { tag = "div", className = "", value = "", content = "", ...props },
    ref
  ) {
    /*
     * 'content' is the raw HTML emitted by the modern exporter. 'value' is the
     * legacy URL-encoded form kept for backward compatibility with older
     * generated code; it needs runtime decoding via removeUnescaped.
     */
    const decodedHtml = content || utils.removeUnescaped(value || "");

    const containerRef = React.useRef<HTMLElement | null>(null);

    const setRef = React.useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      },
      [ref]
    );

    /*
     * <script> tags inserted via innerHTML / dangerouslySetInnerHTML are inert
     * per the HTML5 spec. After mount (and on every value change) walk the
     * container and replace each <script> with a freshly-created element so the
     * browser executes it.
     */
    React.useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      if (!/<script/i.test(decodedHtml)) return;

      const scripts = container.querySelectorAll("script");
      scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        for (const attr of Array.from(oldScript.attributes)) {
          newScript.setAttribute(attr.name, attr.value);
        }
        if (oldScript.textContent) {
          newScript.textContent = oldScript.textContent;
        }
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }, [decodedHtml]);

    return React.createElement(tag, {
      className: className + " w-embed",
      dangerouslySetInnerHTML: { __html: decodedHtml },
      /*
       * Browser HTML parsing of dangerouslySetInnerHTML normalizes attributes
       * and whitespace differently from React's SSR string output, producing
       * false-positive hydration warnings even when the rendered DOM matches.
       */
      suppressHydrationWarning: true,
      ...props,
      ref: setRef,
    });
  }
);

export default HtmlEmbed;
