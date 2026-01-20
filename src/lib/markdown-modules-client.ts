type MarkdownModule = string | (() => Promise<string>);

export const markdownModules = import.meta.glob('../content/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, MarkdownModule>;
