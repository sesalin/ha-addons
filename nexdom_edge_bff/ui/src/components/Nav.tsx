import React from "react";

type NavProps = {
  items: Array<{ id: string; title: string }>;
  current: string;
  onSelect: (id: string) => void;
};

export function Nav({ items, current, onSelect }: NavProps) {
  return (
    <nav className="flex gap-2 flex-wrap">
      {items.map((it) => (
        <button
          key={it.id}
          className={
            "px-3 py-1 rounded-skin border " +
            (current === it.id ? "bg-slate-800 text-white" : "bg-white")
          }
          onClick={() => onSelect(it.id)}
        >
          {it.title}
        </button>
      ))}
    </nav>
  );
}

