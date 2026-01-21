# Repository Cleanup Script for mark-hazleton-s-notes
# Run this script from the repository root directory
# Usage: .\cleanup.ps1 [-DryRun] [-SkipOldBundles] [-SkipCommit]

param(
    [switch]$DryRun,           # Preview changes without executing
    [switch]$SkipOldBundles,   # Skip removing old JS bundles
    [switch]$SkipCommit        # Skip the final git commit
)

$ErrorActionPreference = "Stop"
$RepoRoot = $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Repository Cleanup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "[DRY RUN MODE] No changes will be made" -ForegroundColor Yellow
    Write-Host ""
}

# Track cleanup statistics
$stats = @{
    FilesDeleted = 0
    BytesFreed = 0
}

function Remove-FileIfExists {
    param([string]$Path, [string]$Description)

    if (Test-Path $Path) {
        $size = (Get-Item $Path).Length
        if ($DryRun) {
            Write-Host "  [WOULD DELETE] $Description" -ForegroundColor Yellow
            Write-Host "    Path: $Path" -ForegroundColor Gray
            Write-Host "    Size: $([math]::Round($size / 1MB, 2)) MB" -ForegroundColor Gray
        } else {
            Remove-Item $Path -Force
            Write-Host "  [DELETED] $Description" -ForegroundColor Green
            $script:stats.FilesDeleted++
            $script:stats.BytesFreed += $size
        }
    } else {
        Write-Host "  [SKIPPED] $Description (not found)" -ForegroundColor DarkGray
    }
}

# ============================================
# STEP 1: Remove unnecessary binary files
# ============================================
Write-Host "STEP 1: Removing unnecessary files" -ForegroundColor Magenta
Write-Host ("-" * 40)

Remove-FileIfExists -Path "$RepoRoot\yt-dlp.exe" -Description "yt-dlp.exe (YouTube downloader binary)"
Remove-FileIfExists -Path "$RepoRoot\bun.lockb" -Description "bun.lockb (unused package manager lockfile)"

Write-Host ""

# ============================================
# STEP 2: Remove old versioned JS bundles
# ============================================
if (-not $SkipOldBundles) {
    Write-Host "STEP 2: Removing old versioned JS bundles" -ForegroundColor Magenta
    Write-Host ("-" * 40)
    Write-Host "  Build now uses content hashing (site-[hash].js)" -ForegroundColor Cyan
    Write-Host "  Removing legacy numbered files (site2.js - site99.js)..." -ForegroundColor Cyan
    Write-Host ""

    $assetsPath = "$RepoRoot\docs\assets"
    $deletedCount = 0
    $deletedSize = 0

    if (Test-Path $assetsPath) {
        # Remove ALL numbered site files (site followed by digits)
        # Pattern: site2.js, site10.js, site99.js, etc. (NOT site.js or site-hash.js)
        $numberedFiles = Get-ChildItem -Path $assetsPath -Filter "site*.js" |
            Where-Object { $_.Name -match "^site\d+\.js(\.gz)?$" }

        foreach ($file in $numberedFiles) {
            $size = $file.Length
            if ($DryRun) {
                Write-Host "    [WOULD DELETE] $($file.Name)" -ForegroundColor Yellow
            } else {
                Remove-Item $file.FullName -Force
                $deletedCount++
                $deletedSize += $size
            }
        }

        # Also remove old site.js and site.js.gz (will be replaced by hashed version)
        $oldSiteFiles = @("site.js", "site.js.gz", "site.css", "site.css.gz")
        foreach ($fileName in $oldSiteFiles) {
            $filePath = Join-Path $assetsPath $fileName
            if (Test-Path $filePath) {
                $size = (Get-Item $filePath).Length
                if ($DryRun) {
                    Write-Host "    [WOULD DELETE] $fileName (old unhashed)" -ForegroundColor Yellow
                } else {
                    Remove-Item $filePath -Force
                    $deletedCount++
                    $deletedSize += $size
                }
            }
        }

        if ($deletedCount -gt 0 -or $DryRun) {
            if (-not $DryRun) {
                Write-Host ""
                Write-Host "  [DELETED] $deletedCount files" -ForegroundColor Green
                Write-Host "  [FREED] $([math]::Round($deletedSize / 1MB, 2)) MB" -ForegroundColor Green
                $stats.FilesDeleted += $deletedCount
                $stats.BytesFreed += $deletedSize
            }
        } else {
            Write-Host "  [SKIPPED] No old bundles found" -ForegroundColor DarkGray
        }
    } else {
        Write-Host "  [SKIPPED] docs/assets directory not found" -ForegroundColor DarkGray
    }
} else {
    Write-Host "STEP 2: Skipping JS bundle cleanup (--SkipOldBundles)" -ForegroundColor DarkGray
}

Write-Host ""

# ============================================
# STEP 3: Remove files from git tracking
# ============================================
Write-Host "STEP 3: Updating git tracking" -ForegroundColor Magenta
Write-Host ("-" * 40)

if ($DryRun) {
    Write-Host "  [WOULD RUN] git rm --cached for removed files" -ForegroundColor Yellow
} else {
    # Remove specific files from git tracking if they exist in index
    $null = git rm --cached yt-dlp.exe 2>$null
    $null = git rm --cached bun.lockb 2>$null
    Write-Host "  [DONE] Updated git tracking" -ForegroundColor Green
}

Write-Host ""

# ============================================
# STEP 4: Stage all changes
# ============================================
Write-Host "STEP 4: Staging all changes" -ForegroundColor Magenta
Write-Host ("-" * 40)

if ($DryRun) {
    Write-Host "  [WOULD RUN] git add -A" -ForegroundColor Yellow
} else {
    git add -A
    Write-Host "  [DONE] All changes staged" -ForegroundColor Green
}

Write-Host ""

# ============================================
# STEP 5: Show summary
# ============================================
Write-Host "STEP 5: Summary" -ForegroundColor Magenta
Write-Host ("-" * 40)

Write-Host ""
Write-Host "Git Status:" -ForegroundColor Cyan
$statusOutput = git status --short
$statusOutput | Select-Object -First 20
$statusCount = ($statusOutput | Measure-Object).Count
if ($statusCount -gt 20) {
    Write-Host "  ... and $($statusCount - 20) more files" -ForegroundColor Gray
}

Write-Host ""

if (-not $DryRun) {
    Write-Host "Cleanup Statistics:" -ForegroundColor Cyan
    Write-Host "  Files deleted: $($stats.FilesDeleted)"
    Write-Host "  Space freed: $([math]::Round($stats.BytesFreed / 1MB, 2)) MB"
}

Write-Host ""

# ============================================
# STEP 6: Commit changes
# ============================================
if (-not $SkipCommit -and -not $DryRun) {
    Write-Host "STEP 6: Committing changes" -ForegroundColor Magenta
    Write-Host ("-" * 40)

    $commitMessage = @"
chore: repository cleanup and build optimization

- Remove yt-dlp.exe binary (18 MB)
- Remove bun.lockb (using npm, not bun)
- Remove old versioned JS bundles (site2-site99.js)
- Update vite.config.ts to use content hashing (site-[hash].js)
- Finalize documentation folder reorganization

Build optimization: Assets now use content-based hashing for better
cache invalidation. Old numbered versioning removed.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
"@

    git commit -m $commitMessage
    Write-Host ""
    Write-Host "  [COMMITTED] Cleanup complete!" -ForegroundColor Green
} elseif ($SkipCommit) {
    Write-Host "STEP 6: Skipping commit (--SkipCommit)" -ForegroundColor DarkGray
    Write-Host "  Run 'git commit' manually when ready" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Cleanup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "This was a dry run. To execute, run:" -ForegroundColor Yellow
    Write-Host "  .\cleanup.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Gray
    Write-Host "  -SkipOldBundles  Skip removing old JS bundles" -ForegroundColor Gray
    Write-Host "  -SkipCommit      Stage changes but don't commit" -ForegroundColor Gray
}

Write-Host ""
Write-Host "NEXT STEP: Run 'npm run build' to generate new hashed assets" -ForegroundColor Yellow
Write-Host ""
