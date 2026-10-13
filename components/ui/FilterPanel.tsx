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
  const isToggleGroup = (id: string) => id === "hosting" || id === "license";

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
              if (isToggleGroup(group.id)) {
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onToggle(group.id, option.value)}
                    aria-pressed={checked}
                    className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-moss"
                  >
                    <span className="font-mono text-[12px] uppercase tracking-wider text-fog transition-colors group-hover:text-ink">
                      {option.label}
                    </span>
                    <span className="flex items-center gap-2">
                      {option.count !== undefined && (
                        <span className="font-mono text-[11px] tabular-nums text-dim">
                          {option.count}
                        </span>
                      )}
                      <span
                        className={`relative inline-flex h-5 w-9 items-center rounded-full border p-0.5 transition-colors ${checked ? "border-mint bg-mint/90" : "border-edge bg-void"}`}
                      >
                        <span
                          className={`inline-block h-3 w-3 rounded-full shadow-sm transition-all ${checked ? "translate-x-4 bg-void" : "translate-x-0 bg-dim"}`}
                        />
                      </span>
                    </span>
                  </button>
                );
              }
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onToggle(group.id, option.value)}
                  aria-pressed={checked}
                  className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors ${checked ? "bg-minttint/80 text-ink" : "text-fog hover:bg-moss hover:text-ink"}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] transition-colors ${checked ? "border-mint bg-mint text-void" : "border-edge bg-void group-hover:border-fog"}`}
                    >
                      {checked && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className="font-mono text-[12px] uppercase tracking-wider">
                      {option.label}
                    </span>
                  </span>
                  {option.count !== undefined && (
                    <span className={`font-mono text-[11px] tabular-nums ${checked ? "text-mint" : "text-dim"}`}>
                      {option.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}