param()

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$diagramRoot = Join-Path $repoRoot 'docs/architecture'
$dotCommand = Get-Command dot -ErrorAction Stop

foreach ($diagramName in @('01-system-overview', '02-auth-data-flow')) {
    $sourcePath = Join-Path $diagramRoot "$diagramName.dot"
    $outputPath = Join-Path $diagramRoot "$diagramName.png"
    & $dotCommand.Source -Tpng -Gdpi=150 $sourcePath -o $outputPath
    if ($LASTEXITCODE -ne 0) {
        throw "Graphviz failed to render $diagramName"
    }
    Write-Output "Rendered $diagramName.png"
}
