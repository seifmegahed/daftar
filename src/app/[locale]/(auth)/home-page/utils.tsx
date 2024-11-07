import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

export type SectionType = {
  title: string;
  description: string;
  children: ReactNode;
};

export type SubListItemType = {
  title: string;
  text: string;
};

export function MainListItem({ title, description, children = null }: SectionType) {
  return (
    <li>
      <h4 className="my-2 text-xl font-bold">{title}</h4>
      <p>
        <span>{description}</span>
        {children}
      </p>
    </li>
  );
}

export function SubListItem({ item }: { item: SubListItemType }) {
  const { title, text } = item;
  return (
    <li className="text-sm">
      <strong>{title}</strong>
      <br />
      <span>{text}</span>
    </li>
  );
}

export function SubList({ items }: { items: SubListItemType[] }) {
  return (
    <ul className="my-2 ms-4 list-disc space-y-2">
      {items.map((item) => (
        <SubListItem item={item} key={item.title} />
      ))}
    </ul>
  );
}

export async function Notes({ notes }: { notes: string[] }) {
  const t = await getTranslations("home-page.utils");

  return (
    <div className="my-2 text-sm">
      <span>
        <strong>{t("notes")}</strong>
      </span>
      <ul className="ms-4 list-disc space-y-2">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
