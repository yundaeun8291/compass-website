import fs from 'node:fs';import path from 'node:path';
const root=path.resolve('dist'),out=path.resolve('../../outputs');
const read=p=>fs.readFileSync(path.join(root,p),'utf8').replaceAll('\r\n','\n');
const data=p=>`data:${p.endsWith('.woff2')?'font/woff2':p.endsWith('.svg')?'image/svg+xml':p.endsWith('.mp4')?'video/mp4':p.endsWith('.webp')?'image/webp':p.endsWith('.jpg')?'image/jpeg':'image/png'};base64,${fs.readFileSync(path.join(root,p)).toString('base64')}`;
function inlineSvg(s){return s.replace(/(?:\.\.\/)?images\/[A-Za-z0-9_.-]+/g,p=>data(p.replace('../','')))}
const art=inlineSvg(read('art.svg'));
const assets=Object.fromEntries(fs.readdirSync(path.join(root,'assets')).filter(n=>n.endsWith('.svg')).map(n=>[n.slice(0,-4),inlineSvg(read('assets/'+n))]));
const planningModule=read('planning-player.js').replace('export function','function').replace("'videos/planning-final.mp4'",JSON.stringify('data:video/mp4;base64,'+fs.readFileSync(path.join(root,'videos/planning-final.mp4')).toString('base64'))).replace("'images/planning-final-poster.jpg'",JSON.stringify(data('images/planning-final-poster.jpg')));
const motionModule=read('revision-motion.js').replace('export async function','async function');
const capstoneArt=read('capstone/art.svg').replace(/capstone\/media\/[A-Za-z0-9_.-]+/g,data);
const footage=Object.fromEntries(fs.readdirSync(path.join(root,'capstone/media')).filter(n=>/^[a-z]+\.(mp4|jpg)$/.test(n)).map(n=>[n,data('capstone/media/'+n)]));
const featureSource=read('capstone-features.js').replace(/^export /gm,'')
  .replace("'capstone/media/'+name+'.'+extension","footage[name+'.'+extension]")
  .replace("'capstone/record-'+side+'.svg'","recordArt[side]")
  .replace("'capstone/phone-shell.svg'",()=>JSON.stringify(data('capstone/phone-shell.svg')));
const featureAssets='const footage='+JSON.stringify(footage)+';\nconst recordArt='+JSON.stringify(Object.fromEntries(['left','right','left-front','right-front'].map(side=>[side,data('capstone/record-'+side+'.svg')])))+';\n';
const capstoneSource=read('capstone.js').replace(/^import .*?;\n/m,'').replace(/^export /gm,'')
  .replace(/await fetch\('capstone\/solution\.svg'\)\.then\(response=>\{[\s\S]*?\n  \}\)/,()=>JSON.stringify(read('capstone/solution.svg')))
  .replace("await fetch('capstone/art.svg').then(response => {\n    if (!response.ok) throw Error('Capstone artwork unavailable');\n    return response.text();\n  })",'embeddedCapstoneArt')
  .replace(/'capstone\/(?:wordmark\.mp4|app-icon-(?:guide|final)\.svg)'/g, literal=>JSON.stringify(data(literal.slice(1,-1))));
const capstoneModule='const embeddedCapstoneArt='+JSON.stringify(capstoneArt)+';\nconst {mountCapstone,legacyOffset,sectionStarts}=(()=>{'+featureAssets+'const mountFeatures=(()=>{'+featureSource+'\nreturn mountFeatures;})();\n'+capstoneSource+'\nreturn {mountCapstone,legacyOffset,sectionStarts};})();\n';
let app=read('app.js').replace(/import \{mountCapstone, legacyOffset, sectionStarts\} from .*?;\n/,()=>capstoneModule).replace(/import \{setupPlanningPlayer\} from .*?;\n/,()=>planningModule+'\n').replace(/import \{setupRevisionMotion\} from .*?;\n/,()=>motionModule+'\n').replace(/const svgText=.*\n/,()=>`const svgText=${JSON.stringify(art)};\n`);
app=`const embeddedAssets=${JSON.stringify(assets)};\n`+app;
app=app.replace(/let s=await fetch\('assets\/'.*?;return r.text\(\)\}\);/,"let s=embeddedAssets[name];");
const css=read('style.css').replace('fonts/Pretendard-SemiBold.woff2',data('fonts/Pretendard-SemiBold.woff2'));
let html=read('index.html').replace(/<script src="intro-preload\.js\?v=10"><\/script>/,'').replace(/<video id="intro-preload"[^>]*><\/video>/,'').replace('<link rel="stylesheet" href="style.css?v=10">',`<!-- Pretendard font license\n${read('fonts/LICENSE.txt')}\n--><style>${css}</style>`).replace('<script type="module" src="app.js?v=17"></script>',`<script type="module">${app.replaceAll('</script','<\\/script')}</script>`);
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'COMPASS-capstone.html'),html);
console.log(JSON.stringify({html:path.join(out,'COMPASS-capstone.html'),bytes:Buffer.byteLength(html)}));
