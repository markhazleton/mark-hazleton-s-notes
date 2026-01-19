import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTICLES_JSON = path.resolve(__dirname, '../data/articles.json');
const CONTENT_DIR = path.resolve(__dirname, '../content');
const BACKUP_DIR = path.resolve(__dirname, '../../TEMP/markdown-backup');

/**
 * Create frontmatter YAML from article object
 * @param {object} article - Article object from articles.json
 * @returns {string} YAML frontmatter
 */
function createFrontmatter(article) {
  const lines = [];
  
  // Basic fields
  lines.push(`id: ${article.id}`);
  lines.push(`Section: ${article.Section || 'Uncategorized'}`);
  lines.push(`slug: ${article.slug}`);
  lines.push(`name: ${article.name}`);
  
  if (article.description) {
    lines.push(`description: ${escapeYamlValue(article.description)}`);
  }
  
  if (article.keywords) {
    lines.push(`keywords: ${escapeYamlValue(article.keywords)}`);
  }
  
  if (article.img_src) {
    lines.push(`img_src: ${article.img_src}`);
  }
  
  lines.push(`lastmod: ${article.lastmod || new Date().toISOString().split('T')[0]}`);
  lines.push(`publishedDate: ${article.publishedDate || article.lastmod || new Date().toISOString().split('T')[0]}`);
  lines.push(`estimatedReadTime: ${article.estimatedReadTime || 5}`);
  lines.push(`changefreq: ${article.changefreq || 'monthly'}`);
  
  if (article.subtitle) {
    lines.push(`subtitle: ${escapeYamlValue(article.subtitle)}`);
  }
  
  lines.push(`author: ${article.author || 'Mark Hazleton'}`);
  
  if (article.summary) {
    lines.push(`summary: ${escapeYamlValue(article.summary)}`);
  }
  
  // Conclusion fields (if present)
  if (article.conclusionTitle) {
    lines.push(`conclusionTitle: ${escapeYamlValue(article.conclusionTitle)}`);
  }
  
  if (article.conclusionSummary) {
    lines.push(`conclusionSummary: ${escapeYamlValue(article.conclusionSummary)}`);
  }
  
  if (article.conclusionKeyHeading) {
    lines.push(`conclusionKeyHeading: ${escapeYamlValue(article.conclusionKeyHeading)}`);
  }
  
  if (article.conclusionKeyText) {
    lines.push(`conclusionKeyText: ${escapeYamlValue(article.conclusionKeyText)}`);
  }
  
  if (article.conclusionText) {
    lines.push(`conclusionText: ${escapeYamlValue(article.conclusionText)}`);
  }
  
  // SEO object
  if (article.seo) {
    lines.push('seo:');
    lines.push(`  title: ${escapeYamlValue(article.seo.title || article.name)}`);
    lines.push(`  titleSuffix: ${escapeYamlValue(article.seo.titleSuffix || '')}`);
    lines.push(`  description: ${escapeYamlValue(article.seo.description || article.description || '')}`);
    lines.push(`  keywords: ${escapeYamlValue(article.seo.keywords || article.keywords || '')}`);
    lines.push(`  canonical: ${article.seo.canonical || ''}`);
    lines.push(`  robots: ${article.seo.robots || 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'}`);
  }
  
  // Open Graph object
  if (article.og) {
    lines.push('og:');
    lines.push(`  title: ${escapeYamlValue(article.og.title || article.name)}`);
    lines.push(`  description: ${escapeYamlValue(article.og.description || article.description || '')}`);
    lines.push(`  type: ${article.og.type || 'article'}`);
    lines.push(`  image: ${article.og.image || 'null'}`);
    lines.push(`  imageAlt: ${escapeYamlValue(article.og.imageAlt || 'Mark Hazleton - Solutions Architect')}`);
  }
  
  // Twitter object
  if (article.twitter) {
    lines.push('twitter:');
    lines.push(`  title: ${escapeYamlValue(article.twitter.title || article.name)}`);
    lines.push(`  description: ${escapeYamlValue(article.twitter.description || article.description || '')}`);
    lines.push(`  image: ${article.twitter.image || 'null'}`);
    lines.push(`  imageAlt: ${escapeYamlValue(article.twitter.imageAlt || 'Mark Hazleton - Solutions Architect')}`);
  }
  
  // YouTube fields
  lines.push(`youtubeUrl: ${article.youtubeUrl || 'null'}`);
  lines.push(`youtubeTitle: ${article.youtubeTitle || 'null'}`);
  
  return lines.join('\n');
}

/**
 * Escape YAML value if it contains special characters
 * @param {string} value - Value to escape
 * @returns {string} Escaped value
 */
function escapeYamlValue(value) {
  if (!value) return '';
  
  const str = String(value);
  
  // If contains special characters, wrap in quotes
  if (str.includes(':') || str.includes('#') || str.includes('"') || str.includes('\n') || str.includes('|')) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }
  
  return str;
}

/**
 * Process single markdown file
 * @param {object} article - Article data from articles.json
 * @param {boolean} dryRun - If true, only show what would be done
 */
function processMarkdownFile(article, dryRun = false) {
  const filename = article.contentFile;
  if (!filename) {
    console.warn(`⚠️  Article ID ${article.id} has no contentFile specified`);
    return false;
  }
  
  const filepath = path.join(CONTENT_DIR, filename);
  
  // Check if file exists
  if (!fs.existsSync(filepath)) {
    console.warn(`⚠️  File not found: ${filename}`);
    return false;
  }
  
  // Read existing content
  const content = fs.readFileSync(filepath, 'utf-8');
  
  // Check if already has frontmatter
  if (content.trim().startsWith('---')) {
    console.log(`⏭️  Skipped (already has frontmatter): ${filename}`);
    return true;
  }
  
  // Create frontmatter
  const frontmatter = createFrontmatter(article);
  
  // Combine frontmatter with content
  const newContent = `---\n${frontmatter}\n---\n\n${content}`;
  
  if (dryRun) {
    console.log(`📝 Would update: ${filename}`);
    return true;
  }
  
  // Backup original
  const backupPath = path.join(BACKUP_DIR, filename);
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  fs.copyFileSync(filepath, backupPath);
  
  // Write updated content
  fs.writeFileSync(filepath, newContent, 'utf-8');
  console.log(`✅ Updated: ${filename}`);
  
  return true;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');
  
  console.log('🚀 Migrating markdown files to include frontmatter...\n');
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  } else {
    console.log('💾 Original files will be backed up to:', BACKUP_DIR);
    console.log('');
  }
  
  try {
    // Read articles.json
    const articlesData = fs.readFileSync(ARTICLES_JSON, 'utf-8');
    const articles = JSON.parse(articlesData);
    
    console.log(`📚 Found ${articles.length} articles in articles.json\n`);
    
    let processed = 0;
    let skipped = 0;
    let errors = 0;
    
    // Process each article
    for (const article of articles) {
      const result = processMarkdownFile(article, dryRun);
      if (result === true && article.contentFile && !fs.readFileSync(path.join(CONTENT_DIR, article.contentFile), 'utf-8').trim().startsWith('---')) {
        processed++;
      } else if (result === true) {
        skipped++;
      } else if (result === false) {
        errors++;
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Processed: ${processed}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    
    if (dryRun) {
      console.log('\n💡 Run without --dry-run flag to actually update the files');
    } else if (processed > 0) {
      console.log(`\n💾 Backups saved to: ${BACKUP_DIR}`);
      console.log('\n✨ Migration complete! Next steps:');
      console.log('   1. Review the updated files');
      console.log('   2. Run: npm run generate:articles');
      console.log('   3. Compare generated articles.json with original');
      console.log('   4. Update package.json build scripts (see MIGRATION_GUIDE.md)');
    }
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
}

// Show usage if help flag is passed
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node migrate-to-frontmatter.mjs [options]

Options:
  --dry-run, -d    Preview changes without modifying files
  --help, -h       Show this help message

Description:
  Migrates markdown files to include frontmatter from articles.json.
  Original files are backed up before modification.
  
Examples:
  node migrate-to-frontmatter.mjs --dry-run    # Preview changes
  node migrate-to-frontmatter.mjs              # Run migration
`);
  process.exit(0);
}

main();
