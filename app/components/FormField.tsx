interface FormFieldProps {
  label: string;
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  type?: "text" | "number" | "year";
}

export default function FormField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  type = "text",
}: FormFieldProps) {
  
  const handleChange = (e: any) => {
    let v = e.target.value;

    if (type === "year" || type === "number") {
      v = v.replace(/\D/g, "");

      if (type === "year" && v.length > 4) {
        v = v.slice(0, 4);
      }

      e.target.value = v;
    }

    onChange(e);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-800 mb-0.5">
        {label}
        {required && <span className="text-red-700 ml-0.5">*</span>}
      </label>

      <input
        type="text"
        value={value}
        onChange={disabled ? undefined : handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full border rounded-xl px-4 py-2 shadow-sm
          ${
            disabled
              ? "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed"
              : "bg-white text-gray-700 border-gray-300 focus:ring-1 focus:ring-red-700/40 focus:outline-none"
          }
        `}
      />
    </div>
  );
}
