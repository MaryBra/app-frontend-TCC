import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function Dropdown({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled = false,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full" ref={ref}>
      <label className="block text-sm font-medium text-gray-800 mb-0.5">
        {label}
        {required && <span className="text-red-700 ml-0.5">*</span>}
      </label>

      <div className="relative">
        {/* Campo que abre o dropdown */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
          className={`
            w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-700 shadow-sm
            mt-1 flex justify-between items-center
            focus:ring-1 focus:ring-red-700/40 focus:border-red-700 focus:outline-none
            ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}
          `}
        >
          <span>{options.find((o) => o.value === value)?.label || placeholder}</span>

          <ChevronDown className="text-gray-500" size={20} />
        </button>

        {/* DROPDOWN */}
        {open && !disabled && (
          <div
            className="
              absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg
              max-h-48 overflow-y-auto   /* <= Scroll aqui */
              animate-fadeIn
            "
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`
                  px-4 py-2 cursor-pointer text-sm
                  hover:bg-red-50
                  ${value === opt.value ? "bg-red-100 text-red-700 font-medium" : "text-gray-800"}
                `}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Animação suave */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}
