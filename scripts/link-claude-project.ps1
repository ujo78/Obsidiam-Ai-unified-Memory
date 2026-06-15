<#
.SYNOPSIS
  Onboard a Claude Code project into the AI-Memory vault: move its existing memory files into
  the vault and replace Claude's memory directory with a junction pointing at the vault.
  No admin required (directory junctions work on NTFS without elevation).

.EXAMPLE
  powershell -File link-claude-project.ps1 -ProjectPath "C:\Users\rajra\Desktop\microsoft-build-ai\workflowos"
#>
param(
  [Parameter(Mandatory = $true)] [string] $ProjectPath
)

$ErrorActionPreference = 'Stop'
$vault    = Split-Path -Parent $PSScriptRoot          # <vault>/scripts -> <vault>
$home_    = [Environment]::GetFolderPath('UserProfile')
$projects = Join-Path $home_ '.claude\projects'

$abs     = [System.IO.Path]::GetFullPath($ProjectPath)
$projName = Split-Path -Leaf $abs.TrimEnd('\','/')
$vaultMem = Join-Path $vault "projects\$projName\memory"

# Claude slug = full path with EACH drive/separator char replaced by '-'. Match case-insensitively.
$slug = ($abs -replace '[\\/:]','-')
$slugDir = Get-ChildItem -Path $projects -Directory -ErrorAction SilentlyContinue |
           Where-Object { $_.Name -ieq $slug } | Select-Object -First 1

if (-not $slugDir) {
  Write-Host "Claude has no project directory for '$abs' yet (slug '$slug')."
  Write-Host "Open the project in Claude Code once so it creates the dir, then re-run this script."
  exit 1
}

$claudeMem = Join-Path $slugDir.FullName 'memory'
New-Item -ItemType Directory -Force -Path $vaultMem | Out-Null

# Already a reparse point (junction/symlink)?
if (Test-Path $claudeMem) {
  $item = Get-Item $claudeMem -Force
  if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
    Write-Host "Already junctioned: $claudeMem"
    exit 0
  }
  # Move existing memory files into the vault (only if vault target is empty, to avoid clobbering)
  $existing = Get-ChildItem $claudeMem -Force -ErrorAction SilentlyContinue
  $vaultHas = Get-ChildItem $vaultMem -Force -ErrorAction SilentlyContinue
  if ($existing -and $vaultHas) {
    Write-Host "Both '$claudeMem' and '$vaultMem' contain files. Resolve manually before linking."
    exit 1
  }
  if ($existing) {
    Write-Host "Moving $($existing.Count) memory file(s) into vault: $vaultMem"
    Move-Item -Path (Join-Path $claudeMem '*') -Destination $vaultMem -Force
  }
  Remove-Item $claudeMem -Recurse -Force
}

New-Item -ItemType Junction -Path $claudeMem -Target $vaultMem | Out-Null
Write-Host "Junctioned: $claudeMem  ->  $vaultMem"
