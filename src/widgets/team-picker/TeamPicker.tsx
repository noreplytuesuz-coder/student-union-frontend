import { useMemo, useState } from "react";
import { useLanguage } from "@/app/providers/LanguageContext";
import { useUsers } from "@/entities/user";
import { Avatar, Input } from "@/shared/ui";

const MAX_TEAM = 4;

interface TeamPickerProps {
  value: string[];
  onChange: (ids: string[]) => void;
}

export function TeamPicker({ value, onChange }: TeamPickerProps) {
  const { t } = useLanguage();
  const { data: users = [] } = useUsers();
  const [query, setQuery] = useState("");

  const candidates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users
      .filter((u) => !value.includes(u._id))
      .filter((u) => (q ? u.name.toLowerCase().includes(q) : true))
      .slice(0, 8);
  }, [users, value, query]);

  const selected = users.filter((u) => value.includes(u._id));

  const add = (id: string) => {
    if (value.includes(id) || value.length >= MAX_TEAM) return;
    onChange([...value, id]);
    setQuery("");
  };

  const remove = (id: string) => onChange(value.filter((m) => m !== id));

  return (
    <div className="space-y-2">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((member) => (
            <div
              key={member._id}
              className="flex items-center gap-2 rounded-full neo-border bg-gray-50 dark:bg-white/5 pl-1 pr-2 py-1"
            >
              <Avatar name={member.name} image={member.image} className="w-7 h-7 text-xs" />
              <span className="text-sm">{member.name}</span>
              <button type="button" onClick={() => remove(member._id)} className="hover:text-red-400">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {value.length < MAX_TEAM && (
        <div className="space-y-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Search members...")}
          />
          {query.trim() && candidates.length > 0 && (
            <div className="rounded-xl border border-border/40 bg-gray-50 dark:bg-white/5 divide-y divide-border/30 max-h-44 overflow-y-auto">
              {candidates.map((member) => (
                <button
                  key={member._id}
                  type="button"
                  onClick={() => add(member._id)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-primary/10 text-left"
                >
                  <Avatar name={member.name} image={member.image} className="w-7 h-7 text-xs" />
                  <span className="text-sm">{member.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
