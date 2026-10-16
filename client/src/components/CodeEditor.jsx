import { useEffect, useRef } from "react";
import { highlight } from "../lib/highlight.js";

/**
 * Minimal code editor: a transparent textarea on top of a highlighted <pre>.
 * readOnly = true turns it into a plain code viewer (Code Reader tab).
 */
export default function CodeEditor({ value, onChange, readOnly = false, rows = 14, onKeyDown }) {
  const preRef = useRef(null);
  const taRef = useRef(null);

  const syncScroll = () => {
    const ta = taRef.current;
    const pre = preRef.current;
    if (ta && pre) {
      pre.scrollTop = ta.scrollTop;
      pre.scrollLeft = ta.scrollLeft;
    }
  };

  useEffect(syncScroll, [value]);

  const handleKeyDown = (e) => {
    // Insert 4 spaces on Tab (unless readOnly)
    if (e.key === "Tab" && !readOnly) {
      e.preventDefault();
      const ta = e.target;
      const { selectionStart: s, selectionEnd: end } = ta;
      const next = value.slice(0, s) + "    " + value.slice(end);
      onChange?.(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = s + 4;
      });
    }
    onKeyDown?.(e);
  };

  return (
    <div className="editor">
      <pre
        className="editor-hl"
        ref={preRef}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: highlight(value) + "\n" }}
      />
      <textarea
        className="editor-ta"
        ref={taRef}
        value={value}
        rows={rows}
        spellCheck={false}
        wrap="off"
        readOnly={readOnly}
        tabIndex={readOnly ? -1 : 0}
        onChange={(e) => onChange?.(e.target.value)}
        onScroll={syncScroll}
        onKeyDown={handleKeyDown}
        aria-label={readOnly ? "Code (read only)" : "Code editor"}
      />
    </div>
  );
}
