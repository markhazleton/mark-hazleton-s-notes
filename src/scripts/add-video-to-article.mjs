#!/usr/bin/env node

/**
 * Add YouTube Video to Blog Article
 * 
 * This script automates the process of:
 * 1. Prompting for YouTube video URL and blog article
 * 2. Updating the article's frontmatter with video metadata
 * 3. Regenerating articles.json
 * 4. Regenerating video sitemap for Google indexing
 * 
 * Usage:
 *   node src/scripts/add-video-to-article.mjs
 *   npm run add:video
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.resolve(__dirname, '../content');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline question
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

/**
 * Extract video ID from YouTube URL
 */
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
    /youtube\.com\/v\/([^&\s]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * Fetch video metadata from YouTube (using oEmbed API - no API key needed)
 */
async function fetchVideoMetadata(videoId) {
  try {
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oEmbedUrl);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return {
      title: data.title,
      author: data.author_name,
      thumbnailUrl: data.thumbnail_url
    };
  } catch (error) {
    return null;
  }
}

/**
 * List available markdown files
 */
async function listMarkdownFiles() {
  const files = await fs.readdir(CONTENT_DIR);
  return files
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))
    .sort();
}

/**
 * Parse frontmatter from markdown
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: '', body: content, fullMatch: '' };
  }
  
  return {
    frontmatter: match[1],
    body: content.substring(match[0].length),
    fullMatch: match[0]
  };
}

/**
 * Update frontmatter with video information
 */
function updateFrontmatter(frontmatter, youtubeUrl, youtubeTitle) {
  const lines = frontmatter.split('\n');
  let updated = false;
  let result = [];
  
  // Look for existing youtubeUrl and youtubeTitle
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('youtubeUrl:')) {
      result.push(`youtubeUrl: ${youtubeUrl}`);
      updated = true;
    } else if (line.startsWith('youtubeTitle:')) {
      result.push(`youtubeTitle: "${youtubeTitle}"`);
    } else {
      result.push(line);
    }
  }
  
  // If not found, add before the closing ---
  if (!updated) {
    // Find a good place to insert (before twitter section or at end)
    const insertIndex = result.findIndex(line => 
      line.startsWith('twitter:') || 
      line.startsWith('og:') ||
      line.trim() === ''
    );
    
    if (insertIndex > 0) {
      result.splice(insertIndex, 0, `youtubeUrl: ${youtubeUrl}`);
      result.splice(insertIndex + 1, 0, `youtubeTitle: "${youtubeTitle}"`);
    } else {
      result.push(`youtubeUrl: ${youtubeUrl}`);
      result.push(`youtubeTitle: "${youtubeTitle}"`);
    }
  }
  
  return result.join('\n');
}

/**
 * Main script execution
 */
async function main() {
  console.log('\n🎥 Add YouTube Video to Blog Article\n');
  console.log('This will update your article\'s frontmatter and regenerate SEO assets.\n');
  
  try {
    // Step 1: Get YouTube video URL
    console.log('📺 Step 1: YouTube Video');
    const youtubeUrl = await question('Enter YouTube video URL: ');
    
    if (!youtubeUrl || !youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
      console.error('❌ Invalid YouTube URL');
      rl.close();
      return;
    }
    
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      console.error('❌ Could not extract video ID from URL');
      rl.close();
      return;
    }
    
    console.log(`✓ Video ID: ${videoId}`);
    
    // Fetch video metadata
    console.log('Fetching video metadata...');
    const metadata = await fetchVideoMetadata(videoId);
    
    let suggestedTitle = null;
    if (metadata) {
      console.log(`✓ Video Title: ${metadata.title}`);
      suggestedTitle = metadata.title;
    } else {
      console.log('⚠️  Could not fetch video metadata (will prompt for title)');
    }
    
    // Step 2: Select blog article
    console.log('\n📝 Step 2: Select Blog Article');
    console.log('Available articles:');
    
    const files = await listMarkdownFiles();
    files.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file}`);
    });
    
    const selection = await question('\nEnter article number (or filename): ');
    
    let selectedFile;
    if (/^\d+$/.test(selection)) {
      const index = parseInt(selection) - 1;
      if (index < 0 || index >= files.length) {
        console.error('❌ Invalid selection');
        rl.close();
        return;
      }
      selectedFile = files[index];
    } else {
      if (!selection.endsWith('.md')) {
        selectedFile = selection + '.md';
      } else {
        selectedFile = selection;
      }
      
      if (!files.includes(selectedFile)) {
        console.error('❌ File not found');
        rl.close();
        return;
      }
    }
    
    console.log(`✓ Selected: ${selectedFile}`);
    
    // Step 3: Get video title
    console.log('\n🏷️  Step 3: Video Title');
    const defaultTitle = suggestedTitle || 'Enter video title';
    const videoTitle = await question(`Video title [${defaultTitle}]: `) || suggestedTitle;
    
    if (!videoTitle) {
      console.error('❌ Video title is required');
      rl.close();
      return;
    }
    
    console.log(`✓ Title: ${videoTitle}`);
    
    // Step 4: Update the article
    console.log('\n✍️  Step 4: Updating Article');
    const filePath = path.join(CONTENT_DIR, selectedFile);
    const content = await fs.readFile(filePath, 'utf-8');
    
    const { frontmatter, body, fullMatch } = parseFrontmatter(content);
    
    if (!frontmatter) {
      console.error('❌ No frontmatter found in article');
      rl.close();
      return;
    }
    
    const updatedFrontmatter = updateFrontmatter(frontmatter, youtubeUrl, videoTitle);
    const updatedContent = `---\n${updatedFrontmatter}\n---\n${body}`;
    
    // Backup original file
    const backupPath = filePath + '.backup';
    await fs.writeFile(backupPath, content, 'utf-8');
    console.log(`✓ Backup created: ${path.basename(backupPath)}`);
    
    // Write updated content
    await fs.writeFile(filePath, updatedContent, 'utf-8');
    console.log(`✓ Article updated: ${selectedFile}`);
    
    // Step 5: Prompt to regenerate
    console.log('\n🔄 Step 5: Regenerate SEO Assets');
    console.log('\nTo complete the process, run these commands:');
    console.log('  npm run generate:articles     # Update articles.json');
    console.log('  npm run generate:video-sitemap # Update video sitemap');
    console.log('  npm run build                  # Full rebuild');
    
    const shouldRegenerate = await question('\nRegenerate now? (y/n): ');
    
    if (shouldRegenerate.toLowerCase() === 'y') {
      console.log('\n⚙️  Regenerating assets...');
      const { execSync } = await import('child_process');
      
      try {
        console.log('Running: npm run generate:articles');
        execSync('npm run generate:articles', { stdio: 'inherit' });
        
        console.log('\nRunning: npm run generate:video-sitemap');
        execSync('npm run generate:video-sitemap', { stdio: 'inherit' });
        
        console.log('\n✅ All assets regenerated successfully!');
      } catch (error) {
        console.error('\n❌ Error during regeneration:', error.message);
        console.log('\nYou can run the commands manually later.');
      }
    }
    
    console.log('\n📋 Summary:');
    console.log(`  Article: ${selectedFile}`);
    console.log(`  Video: ${videoTitle}`);
    console.log(`  URL: ${youtubeUrl}`);
    console.log('\n✅ Done! Video has been added to your article.');
    console.log('\nNext steps:');
    console.log('  1. Review the changes in your article');
    console.log('  2. Run: npm run build');
    console.log('  3. Deploy your site');
    console.log('  4. Video will be indexed by Google within 1-2 weeks');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

// Run the script
main();
