import fs from 'node:fs';import path from 'node:path';
const root=path.resolve('dist'),out=path.resolve('../../outputs');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=p=>`data:${p.endsWith('.woff2')?'font/woff2':p.endsWith('.jpg')?'image/jpeg':'image/png'};base64,${fs.readFileSync(path.join(root,p)).toString('base64')}`;
function inlineSvg(s){return s.replace(/(?:\.\.\/)?images\/[A-Za-z0-9_.-]+/g,p=>data(p.replace('../','')))}
const art=inlineSvg(read('art.svg'));
const hover=Object.fromEntries(['카드2-1','카드3-1'].map(n=>[n,inlineSvg(read('assets/'+n+'.svg'))]));
let app=read('app.js').replace(/const svgText=.*\n/,`const svgText=${JSON.stringify(art)};\n`);
app=`const embeddedHover=${JSON.stringify(hover)};\n`+app;
app=app.replace("let s=await fetch('assets/'+name+'.svg').then(r=>r.text());","let s=embeddedHover[name];");
app=app.replace("'images/week3-original-crop.png'",JSON.stringify(data('images/week3-original-crop.png')));
const css=read('style.css').replace('fonts/Pretendard-SemiBold.woff2',data('fonts/Pretendard-SemiBold.woff2'));
let html=read('index.html').replace('<link rel="stylesheet" href="style.css">',`<!-- Pretendard font license\n${read('fonts/LICENSE.txt')}\n--><style>${css}</style>`).replace('<script type="module" src="app.js"></script>',`<script type="module">${app.replaceAll('</script','<\\/script')}</script>`);
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'COMPASS.html'),html);
console.log(JSON.stringify({html:path.join(out,'COMPASS.html'),bytes:Buffer.byteLength(html)}));
