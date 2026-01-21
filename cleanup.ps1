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
    GitChanges = 0
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
            Write-Host "    Path: $Path" -ForegroundColor Gray
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
Write-Host "-" * 40

# Remove yt-dlp.exe (18 MB binary)
Remove-FileIfExists -Path "$RepoRoot\yt-dlp.exe" -Description "yt-dlp.exe (YouTube downloader binary)"

# Remove bun.lockb (repo uses npm, not bun)
Remove-FileIfExists -Path "$RepoRoot\bun.lockb" -Description "bun.lockb (unused package manager lockfile)"

Write-Host ""

# ============================================
# STEP 2: Update .gitignore
# ============================================
Write-Host "STEP 2: Updating .gitignore" -ForegroundColor Magenta
Write-Host "-" * 40

$gitignorePath = "$RepoRoot\.gitignore"
$gitignoreContent = Get-Content $gitignorePath -Raw

$newEntries = @(
    "# Lock files for unused package managers",
    "bun.lockb",
    "yarn.lock",
    "",
    "# Downloaded binaries",
    "yt-dlp.exe",
    "yt-dlp"
)

$entriesToAdd = @()
foreach ($entry in $newEntries) {
    if ($entry -eq "" -or $entry.StartsWith("#")) {
        $entriesToAdd += $entry
    } elseif ($gitignoreContent -notmatch [regex]::Escape($entry)) {
        $entriesToAdd += $entry
    }
}

if ($entriesToAdd.Count -gt 2) {  # More than just comments/blank lines
    if ($DryRun) {
        Write-Host "  [WOULD ADD] New entries to .gitignore:" -ForegroundColor Yellow
        foreach ($entry in $entriesToAdd) {
            if ($entry -ne "" -and -not $entry.StartsWith("#")) {
                Write-Host "    - $entry" -ForegroundColor Gray
            }
        }
    } else {
        $newContent = $gitignoreContent.TrimEnd() + "`n`n" + ($entriesToAdd -join "`n") + "`n"
        Set-Content -Path $gitignorePath -Value $newContent -NoNewline
        Write-Host "  [UPDATED] .gitignore with new entries" -ForegroundColor Green
    }
} else {
    Write-Host "  [SKIPPED] .gitignore already up to date" -ForegroundColor DarkGray
}

Write-Host ""

# ============================================
# STEP 3: Remove old versioned JS bundles
# ============================================
if (-not $SkipOldBundles) {
    Write-Host "STEP 3: Cleaning old JS bundles (keeping latest 5)" -ForegroundColor Magenta
    Write-Host "-" * 40

    $assetsPath = "$RepoRoot\docs\assets"

    # Get all numbered site*.js files and sort by number
    $bundles = Get-ChildItem -Path $assetsPath -Filter "site*.js" |
        Where-Object { $_.Name -match "^site(\d+)\.js$" } |
        ForEach-Object {
            $num = [int]($_.Name -replace "site(\d+)\.js", '$1')
            [PSCustomObject]@{
                File = $_
                Number = $num
            }
        } |
        Sort-Object -Property Number -Descending

    if ($bundles.Count -gt 5) {
        $toKeep = $bundles | Select-Object -First 5
        $toDelete = $bundles | Select-Object -Skip 5

        Write-Host "  Keeping: site$($toKeep[-1].Number).js through site$($toKeep[0].Number).js (latest 5)" -ForegroundColor Cyan
        Write-Host "  Removing: $($toDelete.Count) older bundles" -ForegroundColor Cyan
        Write-Host ""

        $deletedCount = 0
        $deletedSize = 0

        foreach ($bundle in $toDelete) {
            $jsFile = $bundle.File.FullName
            $gzFile = "$jsFile.gz"

            if ($DryRun) {
                Write-Host "    [WOULD DELETE] $($bundle.File.Name)" -ForegroundColor Yellow
            } else {
                $size = $bundle.File.Length
                Remove-Item $jsFile -Force -ErrorAction SilentlyContinue
                if (Test-Path $gzFile) {
                    $size += (Get-Item $gzFile).Length
                    Remove-Item $gzFile -Force -ErrorAction SilentlyContinue
                }
                $deletedCount++
                $deletedSize += $size
            }
        }

        if (-not $DryRun) {
            Write-Host "  [DELETED] $deletedCount bundles (+ gzip files)" -ForegroundColor Green
            Write-Host "  [FREED] $([math]::Round($deletedSize / 1MB, 2)) MB" -ForegroundColor Green
            $stats.FilesDeleted += $deletedCount * 2  # JS + GZ
            $stats.BytesFreed += $deletedSize
        }
    } else {
        Write-Host "  [SKIPPED] Only $($bundles.Count) bundles found, nothing to clean" -ForegroundColor DarkGray
    }
} else {
    Write-Host "STEP 3: Skipping JS bundle cleanup (--SkipOldBundles)" -ForegroundColor DarkGray
}

Write-Host ""

# ============================================
# STEP 4: Remove files from git tracking
# ============================================
Write-Host "STEP 4: Removing deleted files from git tracking" -ForegroundColor Magenta
Write-Host "-" * 40

if ($DryRun) {
    Write-Host "  [WOULD RUN] git rm --cached yt-dlp.exe" -ForegroundColor Yellow
    Write-Host "  [WOULD RUN] git rm --cached bun.lockb" -ForegroundColor Yellow
} else {
    # Remove from git tracking (if they were tracked)
    $null = git rm --cached yt-dlp.exe 2>$null
    $null = git rm --cached bun.lockb 2>$null
    Write-Host "  [DONE] Removed files from git tracking" -ForegroundColor Green
}

Write-Host ""

# ============================================
# STEP 5: Stage all changes
# ============================================
Write-Host "STEP 5: Staging all changes" -ForegroundColor Magenta
Write-Host "-" * 40

if ($DryRun) {
    Write-Host "  [WOULD RUN] git add -A" -ForegroundColor Yellow
} else {
    git add -A
    Write-Host "  [DONE] All changes staged" -ForegroundColor Green
}

Write-Host ""

# ============================================
# STEP 6: Show summary and commit
# ============================================
Write-Host "STEP 6: Summary" -ForegroundColor Magenta
Write-Host "-" * 40

# Show git status
Write-Host ""
Write-Host "Git Status:" -ForegroundColor Cyan
git status --short | Select-Object -First 20
$statusCount = (git status --short | Measure-Object).Count
if ($statusCount -gt 20) {
    Write-Host "  ... and $($statusCount - 20) more files" -ForegroundColor Gray
}

Write-Host ""

if (-not $DryRun) {
    Write-Host "Cleanup Statistics:" -ForegroundColor Cyan
    Write-Host "  Files deleted: $($stats.FilesDeleted)" -ForegroundColor White
    Write-Host "  Space freed: $([math]::Round($stats.BytesFreed / 1MB, 2)) MB" -ForegroundColor White
}

Write-Host ""

# ============================================
# STEP 7: Commit changes
# ============================================
if (-not $SkipCommit -and -not $DryRun) {
    Write-Host "STEP 7: Committing changes" -ForegroundColor Magenta
    Write-Host "-" * 40

    $commitMessage = @"
chore: repository cleanup and organization

- Remove yt-dlp.exe binary (18 MB)
- Remove bun.lockb (using npm, not bun)
- Remove old versioned JS bundles (keeping latest 5)
- Update .gitignore with new exclusions
- Finalize documentation folder reorganization
- Clean up deleted temp files from git tracking

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
"@

    git commit -m $commitMessage
    Write-Host ""
    Write-Host "  [COMMITTED] Cleanup complete!" -ForegroundColor Green
} elseif ($SkipCommit) {
    Write-Host "STEP 7: Skipping commit (--SkipCommit)" -ForegroundColor DarkGray
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
