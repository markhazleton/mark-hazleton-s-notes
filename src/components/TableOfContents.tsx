interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <nav className="paper-card p-4">
      <h4 className="font-heading font-semibold text-sm text-foreground mb-3">
        On this page
      </h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li 
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
          >
            <a
              href={`#${item.id}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
