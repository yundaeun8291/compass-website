import fs from 'node:fs';import path from 'node:path';
const root=path.resolve('dist'),out=path.resolve('../../outputs');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=p=>`data:${p.endsWith('.woff2')?'font/woff2':p.endsWith('.jpg')?'image/jpeg':'image/png'};base64,${fs.readFileSync(path.join(root,p)).toString('base64')}`;
function inlineSvg(s){return s.replace(/(?:\.\.\/)?images\/[A-Za-z0-9_.-]+/g,p=>data(p.replace('../','')))}
const art=inlineSvg(read('art.svg'));
const assets=Object.fromEntries(fs.readdirSync(path.join(root,'assets')).filter(n=>n.endsWith('.svg')).map(n=>[n.slice(0,-4),inlineSvg(read('assets/'+n))]));
const videos=JSON.parse(read('videos/manifest.json'));
for(const video of Object.values(videos)){video.src='data:video/mp4;base64,'+fs.readFileSync(path.join(root,video.src)).toString('base64');if(video.hardware)video.hardware.src=data(video.hardware.src);if(video.poster)video.poster=data(video.poster);if(video.frame)video.frame=data(video.frame)}
const videoModule=read('feature-videos.js').replace('export async function','async function').replace(/const sources=await fetch\(.*?return r.json\(\)\}\);/,'const sources=embeddedVideos;');
const planningModule=read('planning-player.js').replace('export function','function').replace("'videos/planning-final.mp4'",JSON.stringify('data:video/mp4;base64,'+fs.readFileSync(path.join(root,'videos/planning-final.mp4')).toString('base64'))).replace("'images/planning-final-poster.jpg'",JSON.stringify(data('images/planning-final-poster.jpg')));
const motionModule=read('revision-motion.js').replace('export async function','async function');
let app=read('app.js').replace(/import \{setupFeatureVideos\} from .*?;\n/,()=>videoModule+'\n').replace(/import \{setupPlanningPlayer\} from .*?;\n/,()=>planningModule+'\n').replace(/import \{setupRevisionMotion\} from .*?;\n/,()=>motionModule+'\n').replace(/const svgText=.*\n/,()=>`const svgText=${JSON.stringify(art)};\n`);
app=`const embeddedAssets=${JSON.stringify(assets)};\nconst embeddedVideos=${JSON.stringify(videos)};\n`+app;
app=app.replace(/let s=await fetch\('assets\/'.*?;return r.text\(\)\}\);/,"let s=embeddedAssets[name];");
const css=read('style.css').replace('fonts/Pretendard-SemiBold.woff2',data('fonts/Pretendard-SemiBold.woff2'));
let html=read('index.html').replace(/<video id="intro-preload"[^>]*><\/video>/,'').replace('<link rel="stylesheet" href="style.css?v=9">',`<!-- Pretendard font license\n${read('fonts/LICENSE.txt')}\n--><style>${css}</style>`).replace('<script type="module" src="app.js?v=9"></script>',`<script type="module">${app.replaceAll('</script','<\\/script')}</script>`);
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'COMPASS.html'),html);
console.log(JSON.stringify({html:path.join(out,'COMPASS.html'),bytes:Buffer.byteLength(html)}));
