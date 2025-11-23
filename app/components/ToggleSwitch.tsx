interface ToggleSwitchProps {
  label: string;
  value: boolean;
  onChange: (val: boolean) => void;
}

export function ToggleSwitch({ label, value, onChange }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm font-medium text-gray-800">{label}</span>

      <button
        onClick={() => onChange(!value)}
        className={`
          relative inline-flex h-6 w-12 items-center rounded-full transition 
          ${value ? "bg-red-700" : "bg-gray-300"}
        `}
      >
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white shadow transition
            ${value ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  );
}
