cd frontend
npm install
npm run build
cd ..

cd billie-backend
npm install
npm run build
cd ..

$distPath = '../messenger-debt-bot-release-1/'
Copy-Item "billie-backend/package.json" -Destination $distPath -Recurse -Force
Copy-Item "billie-backend/node_modules" -Destination $distPath -Recurse -Force
Copy-Item "billie-backend/dist" -Destination $distPath -Recurse -Force
Copy-Item "frontend/dist" -Destination $distPath"frontend" -Recurse -Force
Copy-Item "assets" -Destination $distPath -Recurse -Force

$indexPath = $distPath+"frontend/dist/index.html"
(Get-Content -Encoding "UTF8" $indexPath) | 
Foreach-Object {$_ -replace '</head>',
    "<script>window.homeUrl='https://billie.money/';window.fbAppId='970214263126821';</script></head>"}  | 
Out-File -Encoding "UTF8" $indexPath
