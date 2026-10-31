import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const base='C:/Users/윤다은/OneDrive/바탕 화면';
const files=['푸터/디자인/디자인 아이콘.svg','푸터/디자인/디자인 아이콘그래피.svg','푸터/디자인/디자인 컬러.svg','푸터/디자인/디자인 타이포그래피 2.svg','푸터/디자인/디자인 타이포그래피.svg','푸터/디자인/디자인 글씨.svg','지형 레이어/나무1.svg','지형 레이어/나무2.svg','지형 레이어/나무3.svg','지형 레이어/나무4.svg','week3 및 목업/week3.svg','week3 및 목업/목업1.svg','week3 및 목업/목업2.svg','week3 및 목업/목업3.svg'];
for(const f of files){let s=fs.readFileSync(path.join(base,f),'utf8');s=s.replace(/data:image\/([\w+.-]+);base64,([A-Za-z0-9+/=\s]+)/g,(_,ext,b64)=>{const bytes=Buffer.from(b64,'base64'),hash=crypto.createHash('sha256').update(bytes).digest('hex').slice(0,20),name=`${hash}.${ext==='jpeg'?'jpg':ext}`;fs.writeFileSync(path.join('dist/images',name),bytes);return `../images/${name}`});fs.writeFileSync(path.join('dist/assets',path.basename(f)),s)}
console.log('Confirmed and imported all 14 revision assets.');
