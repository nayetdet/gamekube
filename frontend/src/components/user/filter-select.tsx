import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type Option = { value: string; label: string };

type FilterSelectProps = {
  name: string;
  label: string;
  defaultValue: string;
  options: Option[];
};

export function FilterSelect({
  name,
  label,
  defaultValue,
  options,
}: FilterSelectProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-xs font-semibold">
        {label}
      </Label>
      <div>
        <Select name={name} defaultValue={defaultValue}>
          <SelectTrigger id={name} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
