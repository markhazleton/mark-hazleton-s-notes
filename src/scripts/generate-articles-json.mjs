import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.resolve(__dirname, '../content');
const OUTPUT_FILE = path.resolve(__dirname, '../data/articles.json');

/**
 * Parse frontmatter from markdown content
 * @param {string} content - The markdown file content
 * @returns {object} Parsed frontmatter object
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return null;
  }

  const frontmatterText = match[1];
  const frontmatter = {};
  
  // Parse YAML-like frontmatter
  const lines = frontmatterText.split('\n');
  let currentKey = null;
  let currentValue = '';
  let inNestedObject = false;
  let nestedObject = {};
  let nestedKey = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) continue;
    
    // Check for nested object start (e.g., "seo:")
    if (trimmedLine.match(/^(\w+):\s*$/) && !inNestedObject) {
      // Save previous key if exists
      if (currentKey) {
        frontmatter[currentKey] = parseValue(currentValue.trim());
      }
      
      inNestedObject = true;
      nestedKey = trimmedLine.slice(0, -1);
      nestedObject = {};
      currentKey = null;
      currentValue = '';
      continue;
    }
    
    // Check for nested property (e.g., "  title: Something")
    if (inNestedObject && trimmedLine.startsWith(' ')) {
      const nestedMatch = trimmedLine.match(/^\s*(\w+):\s*(.*)$/);
      if (nestedMatch) {
        const [, key, value] = nestedMatch;
        nestedObject[key] = parseValue(value);
      }
      continue;
    }
    
    // End of nested object
    if (inNestedObject && !trimmedLine.startsWith(' ')) {
      frontmatter[nestedKey] = nestedObject;
      inNestedObject = false;
      nestedObject = {};
      nestedKey = '';
    }
    
    // Parse regular key-value pair
    const keyValueMatch = trimmedLine.match(/^(\w+):\s*(.*)$/);
    if (keyValueMatch && !inNestedObject) {
      if (currentKey) {
        frontmatter[currentKey] = parseValue(currentValue.trim());
      }
      
      const [, key, value] = keyValueMatch;
      currentKey = key;
      currentValue = value;
    } else if (currentKey) {
      // Continuation of multiline value
      currentValue += '\n' + trimmedLine;
    }
  }
  
  // Save the last key
  if (inNestedObject) {
    frontmatter[nestedKey] = nestedObject;
  } else if (currentKey) {
    frontmatter[currentKey] = parseValue(currentValue.trim());
  }
  
  return frontmatter;
}

/**
 * Parse a value to appropriate type
 * @param {string} value - The string value to parse
 * @returns {*} Parsed value (string, number, boolean, null, or object)
 */
function parseValue(value) {
  if (!value || value === 'null') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  
  // Try to parse as number
  if (/^\d+$/.test(value)) {
    return parseInt(value, 10);
  }
  
  // Remove quotes if present
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  
  return value;
}

/**
 * Process all markdown files in the content directory
 * @returns {Array} Array of article objects
 */
function processMarkdownFiles() {
  const articles = [];
  const files = fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.md') && f !== '_TEMPLATE.md');
  
  console.log(`Found ${files.length} markdown files`);
  
  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatter = parseFrontmatter(content);
    
    if (!frontmatter) {
      console.warn(`⚠️  No frontmatter found in ${file}`);
      continue;
    }
    
    // Build article object with all metadata
    const article = {
      id: frontmatter.id || 0,
      Section: frontmatter.Section || 'Uncategorized',
      slug: frontmatter.slug || file.replace('.md', '.html'),
      name: frontmatter.name || frontmatter.title || file.replace('.md', ''),
      contentFile: file,
      description: frontmatter.description || '',
      keywords: frontmatter.keywords || '',
      img_src: frontmatter.img_src || '/img/MarkHazleton.jpg',
      lastmod: frontmatter.lastmod || new Date().toISOString().split('T')[0],
      publishedDate: frontmatter.publishedDate || frontmatter.lastmod || new Date().toISOString().split('T')[0],
      estimatedReadTime: frontmatter.estimatedReadTime || 5,
      changefreq: frontmatter.changefreq || 'monthly',
      source: `/src/content/${file}`,
      subtitle: frontmatter.subtitle || '',
      author: frontmatter.author || 'Mark Hazleton',
      summary: frontmatter.summary || frontmatter.description || '',
      conclusionTitle: frontmatter.conclusionTitle || '',
      conclusionSummary: frontmatter.conclusionSummary || '',
      conclusionKeyHeading: frontmatter.conclusionKeyHeading || '',
      conclusionKeyText: frontmatter.conclusionKeyText || '',
      conclusionText: frontmatter.conclusionText || '',
      seo: frontmatter.seo || {
        title: frontmatter.name || frontmatter.title,
        titleSuffix: '',
        description: frontmatter.description || '',
        keywords: frontmatter.keywords || '',
        canonical: `https://markhazleton.com/${frontmatter.slug || file.replace('.md', '.html')}`,
        robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
      },
      og: frontmatter.og || {
        title: frontmatter.name || frontmatter.title,
        description: frontmatter.description || '',
        type: 'article',
        image: frontmatter.img_src || null,
        imageAlt: frontmatter.imageAlt || 'Mark Hazleton - Solutions Architect'
      },
      twitter: frontmatter.twitter || {
        title: frontmatter.name || frontmatter.title,
        description: frontmatter.description || '',
        image: frontmatter.img_src || null,
        imageAlt: frontmatter.imageAlt || 'Mark Hazleton - Solutions Architect'
      },
      youtubeUrl: frontmatter.youtubeUrl || null,
      youtubeTitle: frontmatter.youtubeTitle || null
    };
    
    articles.push(article);
    console.log(`✓ Processed: ${file}`);
  }
  
  // Sort by ID
  articles.sort((a, b) => a.id - b.id);
  
  return articles;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Generating articles.json from markdown files...\n');
  
  try {
    const articles = processMarkdownFiles();
    
    // Write to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2), 'utf-8');
    
    console.log(`\n✅ Successfully generated ${OUTPUT_FILE}`);
    console.log(`📊 Total articles: ${articles.length}`);
  } catch (error) {
    console.error('❌ Error generating articles.json:', error);
    process.exit(1);
  }
}

main();
