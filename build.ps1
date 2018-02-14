tsc
npm install
$distPath = '../messenger-debt-bot-release/'
Copy-Item "frontend/dist" -Destination $distPath"frontend" -Recurse -Force
Copy-Item "src" -Destination $distPath -Recurse -Exclude "*.ts","*.js.map" -Force
Copy-Item "assets" -Destination $distPath -Recurse -Force

$json = Get-Content package.json | ConvertFrom-Json
$json.scripts.postinstall = ''
$json | ConvertTo-Json | Out-File -encoding ASCII $distPath"package.json" -Force

#TODO update index with <script>window.homeUrl='https://billie.money/';window.fbAppId='970214263126821';</script>
#TODO clean dist