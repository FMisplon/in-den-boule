"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { MenuDietaryLabel, MenuItem } from "@/lib/site-data";

type MenuBrowserProps = {
  items: MenuItem[];
};

const ALL_DIETARY_LABELS = "Alle dieetwensen";

function MenuDietaryIcon({ label }: { label: MenuDietaryLabel }) {
  if (label === "Glutenvrij") {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M10 3.5c2.1 1.7 3.2 4 3.2 6.8 0 3.2-1.4 5.3-3.2 6.2-1.8-.9-3.2-3-3.2-6.2 0-2.8 1.1-5.1 3.2-6.8Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 5.5v9m-2.1-6.3 2.1 1.3m2.1-1.3-2.1 1.3m-2.1 2 2.1 1.4m2.1-1.4-2.1 1.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (label === "Vegan") {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M15.7 4.3c-4.9.2-8 2.3-9.9 6.6-.5 1.1-.8 2.2-.9 3.4 1.2-.1 2.3-.4 3.4-.9 4.3-1.9 6.4-5 6.6-9.1 0-.2.4-.2.8 0Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.1 12.9c1.7-2.4 3.8-4.6 6.1-6.1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M10 16.2c-3.9-2.3-6-5.1-6-8.1 0-2.1 1.6-3.8 3.7-3.8 1.1 0 1.9.4 2.3 1.1.4-.7 1.2-1.1 2.3-1.1 2.1 0 3.7 1.7 3.7 3.8 0 3-2.1 5.8-6 8.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MenuBrowser({ items }: MenuBrowserProps) {
  const categories = useMemo(
    () => ["Alles", ...Array.from(new Set(items.map((item) => item.category)))],
    [items]
  );
  const labels = useMemo<(MenuDietaryLabel | typeof ALL_DIETARY_LABELS)[]>(
    () => [ALL_DIETARY_LABELS, ...Array.from(new Set(items.flatMap((item) => item.tags || [])))],
    [items]
  );
  const [activeCategory, setActiveCategory] = useState("Alles");
  const [activeLabel, setActiveLabel] = useState<MenuDietaryLabel | typeof ALL_DIETARY_LABELS>(
    ALL_DIETARY_LABELS
  );

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = activeCategory === "Alles" || item.category === activeCategory;
      const matchesLabel = activeLabel === ALL_DIETARY_LABELS || (item.tags || []).includes(activeLabel);

      return matchesCategory && matchesLabel;
    });
  }, [activeCategory, activeLabel, items]);

  return (
    <>
      <div className="menu-filter-stack">
        <div className="menu-filter-group">
          <span className="menu-filter-heading">Categorie</span>
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
        </div>

        {labels.length > 1 ? (
          <div className="menu-filter-group">
            <span className="menu-filter-heading">Dieetwensen</span>
            <div className="menu-filter" role="tablist" aria-label="Menulabels">
              {labels.map((label) => (
                <button
                  key={label}
                  className={`filter-chip filter-chip-secondary ${activeLabel === label ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setActiveLabel(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="menu-grid">
        {visibleItems.map((item) => (
          <article
            className={`menu-card ${item.imageUrl ? "menu-card-with-image" : "menu-card-no-image"}`}
            key={`${item.category}-${item.title}`}
          >
            {item.imageUrl ? (
              <div className="menu-card-media">
                <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 980px) 100vw, 33vw" />
              </div>
            ) : null}
            <div className="menu-card-body">
              <span>{item.category}</span>
              <h3>{item.title}</h3>
              {item.tags?.length ? (
                <div className="menu-card-tags" aria-label={`Dieetwensen voor ${item.title}`}>
                  {item.tags.map((tag) => (
                    <em className="menu-card-tag" key={`${item.title}-${tag}`}>
                      <MenuDietaryIcon label={tag} />
                      {tag}
                    </em>
                  ))}
                </div>
              ) : null}
              <p>{item.description}</p>
              <strong>{item.price}</strong>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
