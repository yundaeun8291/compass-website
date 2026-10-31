import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const base='C:/Users/윤다은/OneDrive/바탕 화면';
const files=['record 카드 3개/카드1.svg','record 카드 3개/카드2.svg','record 카드 3개/카드2-1.svg','record 카드 3개/카드3.svg','record 카드 3개/카드3-1.svg','week3 및 목업/목업1.svg','week3 및 목업/목업2.svg','week3 및 목업/목업3.svg','week3 및 목업/week3.svg','푸터/푸터1.svg','푸터/푸터2.svg','푸터/푸터 1-1 글씨.svg','푸터/푸터 2-2 글씨.svg','마이페이지.svg'];
for(const f of files){let s=fs.readFileSync(path.join(base,f),'utf8');s=s.replace(/data:image\/([\w+.-]+);base64,([A-Za-z0-9+/=\s]+)/g,(_,ext,b64)=>{const bytes=Buffer.from(b64,'base64'),hash=crypto.createHash('sha256').update(bytes).digest('hex').slice(0,20),name=`${hash}.${ext==='jpeg'?'jpg':ext}`;fs.writeFileSync(path.join('dist/images',name),bytes);return `../images/${name}`});fs.writeFileSync(path.join('dist/assets',path.basename(f)),s)}
console.log('Confirmed and imported all 14 revision assets.');
