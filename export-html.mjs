import fs from 'node:fs';import path from 'node:path';
const root=path.resolve('dist'),out=path.resolve('../../outputs');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=p=>`data:${p.endsWith('.woff2')?'font/woff2':p.endsWith('.jpg')?'image/jpeg':'image/png'};base64,${fs.readFileSync(path.join(root,p)).toString('base64')}`;
function inlineSvg(s){return s.replace(/(?:\.\.\/)?images\/[A-Za-z0-9_.-]+/g,p=>data(p.replace('../','')))}
const art=inlineSvg(read('art.svg'));
const assets=Object.fromEntries(['목업1','목업2','목업3','카드1','카드2','카드2-1','카드3','카드3-1','마이페이지','푸터1','푸터2'].map(n=>[n,inlineSvg(read('assets/'+n+'.svg'))]));
let app=read('app.js').replace(/const svgText=.*\n/,`const svgText=${JSON.stringify(art)};\n`);
app=`const embeddedAssets=${JSON.stringify(assets)};\n`+app;
app=app.replace(/let s=await fetch\('assets\/'.*?;return r.text\(\)\}\);/,"let s=embeddedAssets[name];");
app=app.replace("'images/week3-original-crop.png'",JSON.stringify(data('images/week3-original-crop.png')));
const css=read('style.css').replace('fonts/Pretendard-SemiBold.woff2',data('fonts/Pretendard-SemiBold.woff2'));
let html=read('index.html').replace('<link rel="stylesheet" href="style.css?v=2">',`<!-- Pretendard font license\n${read('fonts/LICENSE.txt')}\n--><style>${css}</style>`).replace('<script type="module" src="app.js?v=2"></script>',`<script type="module">${app.replaceAll('</script','<\\/script')}</script>`);
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'COMPASS.html'),html);
console.log(JSON.stringify({html:path.join(out,'COMPASS.html'),bytes:Buffer.byteLength(html)}));
