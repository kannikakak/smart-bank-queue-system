import type { ReactNode } from "react";

type TimelineListItem = {
  id: string;
  title: ReactNode;
  description: string;
};

type TimelineListProps = {
  title: string;
  items: TimelineListItem[];
};

export function TimelineList({ title, items }: TimelineListProps) {
  return (
    <article className="list-card timeline-panel">
      <h3>{title}</h3>
      <div className="timeline">
        {items.map((item, index) => (
          <div className="timeline-item" key={item.id}>
            <span className="timeline-index">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
