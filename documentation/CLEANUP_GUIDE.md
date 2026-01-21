# Repository Cleanup Guide

## Summary

This repository needs cleanup to organize documentation and remove temporary files. I've created:

1. ✓ **documentation/** folder with README
2. ✓ Updated **.gitignore** to exclude temporary files
3. ✓ **cleanup-repo.ps1** script to automate the cleanup

## Manual Cleanup Steps

Since the automated script may require execution policy changes, here are the manual steps:

### 1. Move Documentation Files to documentation/ folder

Move these files from root to `documentation/`:
- ARTICLES_MANAGEMENT.md
- GITHUB_PAGES_DEPLOYMENT.md
- MIGRATION_GUIDE.md  
- QUICK_FIX_DEPLOYMENT.md
- SCHEMA_REFERENCE.md
- SEO_IMPROVEMENTS.md
- YOUTUBE_CACHING_IMPLEMENTATION.md
- TEMP/ folder

### 2. Delete Temporary Files

Delete all files matching these patterns from root:
- tmpclaude-* (48+ temporary files)
- yt-dlp.exe (if present)

### 3. Run the Script (Alternative)

If you want to use the PowerShell script:

```powershell
# In PowerShell, from the repository root:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\cleanup-repo.ps1
```

Or simply:
```powershell
# From repository root
Get-ChildItem tmpclaude-* | Remove-Item -Force
Move-Item *.md documentation\ -Include ARTICLES_MANAGEMENT.md,GITHUB_PAGES_DEPLOYMENT.md,MIGRATION_GUIDE.md,QUICK_FIX_DEPLOYMENT.md,SCHEMA_REFERENCE.md,SEO_IMPROVEMENTS.md,YOUTUBE_CACHING_IMPLEMENTATION.md
Move-Item TEMP documentation\
Remove-Item yt-dlp.exe -ErrorAction SilentlyContinue
```

## Final Structure

After cleanup, root should contain only:

**Configuration Files:**
- package.json, package-lock.json, bun.lockb
- tsconfig*.json
- vite.config.ts, eslint.config.js, postcss.config.js, tailwind.config.ts
- components.json
- staticwebapp.config.json
- index.html
- .gitignore

**Essential Files:**
- README.md
- LICENSE, LICENSE-CONTENT

**Folders:**
- src/ (source code)
- docs/ (built/published site)
- documentation/ (dev documentation - NEW)
- node_modules/, .git/, .github/, .vs/, .youtube-cache/, .claude/

## .gitignore Updated

The .gitignore now includes:
```
# Temporary files
tmpclaude-*
*.exe
TEMP/
```

This prevents these files from being committed in the future.

## Documentation Folder

The new `documentation/` folder contains:
- All development/deployment guides
- TEMP/ folder with drafts and temporary content
- README.md explaining the folder structure

Nothing in `documentation/` is processed by the build or deployed to the live site.

## Why This Cleanup?

- **Reduces clutter** in repository root
- **Organizes documentation** in one logical place
- **Prevents temporary files** from cluttering git history
- **Makes root directory** easier to navigate
- **Separates concerns** (source vs. documentation vs. build output)

## After Cleanup

1. Review the changes
2. Commit to git:
   ```bash
   git add .
   git commit -m "chore: organize documentation and clean up temporary files"
   git push
   ```

3. Delete the cleanup script if desired:
   ```bash
   Remove-Item cleanup-repo.ps1
   ```
