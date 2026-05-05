"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";

type FormFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  type: "email" | "password" | "tel";
  value: string;
  onChange: (value: string) => void;
};

const fieldIcon = (type: "email" | "password" | "tel") =>
  type === "password" ? Lock : User;

export const FormField = ({
  name,
  label,
  placeholder,
  type,
  value,
  onChange,
}: FormFieldProps) => {
  const [visible, setVisible] = useState(false);
  const Icon = fieldIcon(type);
  const inputType = type === "password" && !visible ? "password" : type === "tel" ? "tel" : "text";

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm text-gray-600">
        {label}
      </label>

      <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus-within:border-gray-400 transition-colors">
        <Icon className="w-4 h-4 text-gray-400 shrink-0" />

        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          required
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {visible ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}

      </div>
    </div>
  );
};
