import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const dir=path.resolve('dist');
fs.mkdirSync(path.join(dir,'images'),{recursive:true});
for(const name of ['art.svg',...fs.readdirSync(path.join(dir,'assets')).map(n=>'assets/'+n)]){
 let s=fs.readFileSync(path.join(dir,name),'utf8');
 s=s.replace(/data:image\/([\w+.-]+);base64,([A-Za-z0-9+/=\s]+)/g,(_,ext,b64)=>{
 const bytes=Buffer.from(b64,'base64'), hash=crypto.createHash('sha256').update(bytes).digest('hex').slice(0,20);
 const file=`${hash}.${ext==='jpeg'?'jpg':ext}`;fs.writeFileSync(path.join(dir,'images',file),bytes);
 return `${name.startsWith('assets/')?'../':''}images/${file}`;
 });
 fs.writeFileSync(path.join(dir,name),s);
}
fs.rmSync(path.join(dir,'original.svg'));
fs.writeFileSync(path.join(dir,'index.html'),`<!doctype html><html lang="ko"><meta charset="utf-8"><title>COMPASS</title><style>body{margin:0}#art>svg{width:100%;height:auto;display:block}</style><main id="art"></main><script>fetch('art.svg').then(r=>r.text()).then(s=>document.getElementById('art').innerHTML=s)</script></html>`);
fs.writeFileSync(path.join(dir,'review.html'),`<!doctype html><html><meta charset="utf-8"><style>body{margin:0}svg{display:block;width:480px;height:auto}</style><main></main><script>fetch('art.svg').then(r=>r.text()).then(s=>{document.querySelector('main').innerHTML=s;let svg=document.querySelector('svg'),y=+(new URLSearchParams(location.search).get('y')||0);svg.setAttribute('viewBox','0 '+y+' 1920 6000');svg.setAttribute('height','6000');})</script></html>`);
console.log('Prepared original artwork and assets');
