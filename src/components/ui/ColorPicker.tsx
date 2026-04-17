import { COLOR_OPTIONS } from "../../types";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {COLOR_OPTIONS.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => onChange(c.key)}
          className={`w-7 h-7 rounded-full ${c.bg} transition-transform ${
            value === c.key ? "scale-125 ring-2 ring-offset-1 ring-slate-400" : "hover:scale-110"
          }`}
        />
      ))}
    </div>
  );
}
