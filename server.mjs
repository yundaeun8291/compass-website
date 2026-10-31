import http from 'node:http';import fs from 'node:fs';import path from 'node:path';
const root=path.resolve('dist');
http.createServer((req,res)=>{try{
 let p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(!p.startsWith(root+path.sep)&&p!==root)throw Error();
 if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');
 const size=fs.statSync(p).size,ext=path.extname(p);
 res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.svg':'image/svg+xml','.js':'text/javascript','.css':'text/css','.json':'application/json','.mp4':'video/mp4','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'})[ext]||'application/octet-stream');
 res.setHeader('Accept-Ranges','bytes');
 const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
 if(range){const start=+range[1],end=Math.min(range[2]?+range[2]:size-1,size-1);if(start> end){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return}res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});fs.createReadStream(p,{start,end}).pipe(res)}else{res.setHeader('Content-Length',size);fs.createReadStream(p).pipe(res)}
 }catch{res.statusCode=404;res.end()}
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://localhost:4173'));
