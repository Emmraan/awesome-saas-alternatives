"use client";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

export function FilterPanel({
  groups,
  selected,
  onToggle,
}: {
  groups: FilterGroup[];
  selected: Record<string, string[]>;
  onToggle: (groupId: string, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <fieldset key={group.id} className="min-w-0">
          <legend className="mb-2 text-xs font-medium text-muted-foreground">
            {group.label}
          </legend>
          <div className="flex flex-col gap-0.5">
            {group.options.map((option) => {
              const checked =
                selected[group.id]?.includes(option.value) ?? false;
              return (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(group.id, option.value)}
                    className="h-4 w-4 shrink-0 rounded border-input accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  />
                  <span className="flex-1">{option.label}</span>
                  {option.count !== undefined && (
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {option.count}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}