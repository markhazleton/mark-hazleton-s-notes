interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
}

export function TagFilter({ tags, selectedTags, onToggle }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onToggle(tag)}
          className={`tag-pill transition-all ${
            selectedTags.includes(tag)
              ? 'tag-pill-active'
              : ''
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
