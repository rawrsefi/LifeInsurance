"use client";

import { useId, useState, type ComponentPropsWithoutRef } from "react";

/**
 * Masks input like a password while typing (reduces shoulder-surfing / screen capture exposure).
 * Values still exist in memory for submission; the full form JSON is encrypted before `fetch`.
 */
export function SensitiveField({
  value,
  onChange,
  className,
  maxLength,
  placeholder,
  inputMode,
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  className: string;
  maxLength?: number;
  placeholder?: string;
  inputMode?: ComponentPropsWithoutRef<"input">["inputMode"];
  "aria-label"?: string;
}) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${className} pr-[4.5rem]`}
        maxLength={maxLength}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete="off"
        spellCheck={false}
        autoCorrect="off"
        aria-label={ariaLabel}
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        tabIndex={-1}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
