"use client";

import type { InputHTMLAttributes } from "react";

type TextFieldProps = {
  label: string;
  id: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function TextField({ label, id, ...rest }: TextFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        {...rest}
        className={
          "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg " +
          "focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all " +
          (rest.className ?? "")
        }
      />
    </div>
  );
}
