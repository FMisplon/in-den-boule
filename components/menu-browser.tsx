"use client";

import { useMemo, useState } from "react";
import type { MenuItem } from "@/lib/site-data";

type MenuBrowserProps = {
  items: MenuItem[];
};

export function MenuBrowser({ items }: MenuBrowserProps) {
  const categories = useMemo(
    () => ["Alles", ...Array.from(new Set(items.map((item) => item.category)))],
    [items]
  );
  const [activeCategory, setActiveCategory] = useState("Alles");

  const visibleItems = useMemo(() => {
    if (activeCategory === "Alles") {
      return items;
    }

    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  return (
    <>
      <div className="menu-filter" role="tablist" aria-label="Menucategorieen">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-chip ${activeCategory === category ? "is-active" : ""}`}
            type="button"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {visibleItems.map((item) => (
          <article className="menu-card" key={`${item.category}-${item.title}`}>
            <span>{item.label || item.category}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <strong>{item.price}</strong>
          </article>
        ))}
      </div>
    </>
  );
}
