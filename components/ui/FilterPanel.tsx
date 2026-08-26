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
        <fieldset key={group.id} className="min-w-0 rounded-lg border border-line bg-pine p-3 shadow-card">
          <legend className="px-1 font-mono text-[10.5px] font-medium uppercase tracking-widest text-dim">
            {group.label}
          </legend>
          <div className="mt-2 flex flex-col gap-0.5">
            {group.options.map((option) => {
              const checked = selected[group.id]?.includes(option.value) ?? false;
              return (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-moss data-[checked=true]:bg-mint/5"
                  data-checked={checked}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(group.id, option.value)}
                    className="h-4 w-4 shrink-0 rounded border-edge bg-raised accent-mint"
                  />
                  <span className="flex-1 text-[13px] font-medium text-ink">{option.label}</span>
                  {option.count !== undefined && (
                    <span className="rounded-full border border-line bg-raised px-2 py-0.5 font-mono text-[11px] tabular-nums text-dim">
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