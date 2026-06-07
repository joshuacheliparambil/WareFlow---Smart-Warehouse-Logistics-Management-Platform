$ErrorActionPreference = "Stop"

$mvn = Get-Command mvn -ErrorAction SilentlyContinue
if ($mvn) {
  & $mvn.Source spring-boot:run "-Dspring-boot.run.profiles=local"
  exit $LASTEXITCODE
}

$workDir = Join-Path $PSScriptRoot ".maven"
$zip = Join-Path $workDir "apache-maven.zip"
$mavenDir = Join-Path $workDir "apache-maven-3.9.16"
$mvnCmd = Join-Path $mavenDir "bin\mvn.cmd"

if (!(Test-Path $mvnCmd)) {
  New-Item -ItemType Directory -Force -Path $workDir | Out-Null
  Invoke-WebRequest -Uri "https://dlcdn.apache.org/maven/maven-3/3.9.16/binaries/apache-maven-3.9.16-bin.zip" -OutFile $zip
  Expand-Archive -Path $zip -DestinationPath $workDir -Force
}

& $mvnCmd spring-boot:run "-Dspring-boot.run.profiles=local"
