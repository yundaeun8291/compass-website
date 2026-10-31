import fs from 'node:fs';import path from 'node:path';
const root=path.resolve('dist'),out=path.resolve('../../outputs');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=p=>`data:${p.endsWith('.woff2')?'font/woff2':p.endsWith('.jpg')?'image/jpeg':'image/png'};base64,${fs.readFileSync(path.join(root,p)).toString('base64')}`;
function inlineSvg(s){return s.replace(/(?:\.\.\/)?images\/[A-Za-z0-9_.-]+/g,p=>data(p.replace('../','')))}
const art=inlineSvg(read('art.svg'));
const assets=Object.fromEntries(['week3','목업1','목업2','목업3','디자인 글씨','디자인 아이콘','디자인 타이포그래피','디자인 타이포그래피 2','디자인 아이콘그래피','디자인 컬러','나무1','나무2','나무3','나무4','카드1','카드2','카드2-1','카드3','카드3-1','마이페이지','푸터1','푸터2'].map(n=>[n,inlineSvg(read('assets/'+n+'.svg'))]));
const videos=JSON.parse(read('videos/manifest.json'));
for(const video of Object.values(videos)){video.src='data:video/mp4;base64,'+fs.readFileSync(path.join(root,video.src)).toString('base64');if(video.hardware)video.hardware.src=data(video.hardware.src)}
const videoModule=read('feature-videos.js').replace('export async function','async function').replace(/const sources=await fetch\(.*?return r.json\(\)\}\);/,'const sources=embeddedVideos;');
let app=read('app.js').replace("import {setupFeatureVideos} from './feature-videos.js?v=4';",videoModule).replace(/const svgText=.*\n/,`const svgText=${JSON.stringify(art)};\n`);
app=`const embeddedAssets=${JSON.stringify(assets)};\nconst embeddedVideos=${JSON.stringify(videos)};\n`+app;
app=app.replace(/let s=await fetch\('assets\/'.*?;return r.text\(\)\}\);/,"let s=embeddedAssets[name];");
const css=read('style.css').replace('fonts/Pretendard-SemiBold.woff2',data('fonts/Pretendard-SemiBold.woff2'));
let html=read('index.html').replace('<link rel="stylesheet" href="style.css?v=4">',`<!-- Pretendard font license\n${read('fonts/LICENSE.txt')}\n--><style>${css}</style>`).replace('<script type="module" src="app.js?v=4"></script>',`<script type="module">${app.replaceAll('</script','<\\/script')}</script>`);
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'COMPASS.html'),html);
console.log(JSON.stringify({html:path.join(out,'COMPASS.html'),bytes:Buffer.byteLength(html)}));
