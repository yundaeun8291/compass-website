export async function setupRevisionMotion({svg,scene,node,make,group,range,importSvg,animate,watch,watchers,reduced}){
 const defs=svg.querySelector('defs');let serial=0;
 function enterMotion(element,y,height,{duration=700,delay=0,distance=28}={}){
  let a;element.style.opacity='0';watchers.push(watch(y,height,()=>{a?.cancel();a=animate(element,[{opacity:0,transform:`translateY(${distance}px)`},{opacity:1,transform:'translateY(0)'}],{duration,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'})},()=>{a?.cancel();element.style.opacity='0'}));
 }
 async function replace(name,ids,anchor=ids[0],localIndex=0){
  const old=node(anchor),box=old.getBBox(),asset=await importSvg(name),motion=make('g',{'data-planning':name});
  old.before(motion);motion.append(asset);const local=asset.children[localIndex].getBBox();asset.setAttribute('x',box.x-local.x);asset.setAttribute('y',box.y-local.y);asset.style.overflow='visible';ids.forEach(i=>node(i)?.remove());return {asset,motion,box:motion.getBBox()};
 }
 // The hero's original translucent symbols remain at their original positions.
 const hero=[group([5,6]),node(70),node(72)];hero.forEach((e,i)=>{if(!reduced)animate(e,[{transform:'translateY(0)'},{transform:'translateY(-12px)'},{transform:'translateY(0)'}],{duration:6600+i*750,delay:-i*1700,iterations:Infinity,easing:'ease-in-out'})});
 // Overview retains its image and shade; only the outlined type rises.
 const overview=node(17),overviewPaths=Array.from(overview.querySelectorAll('path')).filter(e=>!e.closest('defs'));
 if(overviewPaths.length){const texts=make('g',{'data-planning':'오버뷰'});overviewPaths[0].before(texts);overviewPaths.forEach(e=>texts.append(e));const b=texts.getBBox();enterMotion(texts,b.y,b.height)}
 for(const [name,ids]of [['survey',range(56,62)],['인사이트',[13,15]],['질문1',range(74,76)],['질문2',range(77,79)],['질문3',range(80,82)],['페르소나 글씨',[19]],['솔루션 글씨',[14,16]]]){const r=await replace(name,ids);enterMotion(r.motion,r.box.y,r.box.height)}
 // Clip the original colored chart geometry, never redraw the charts.
 function chartGroup(root,indices){const children=Array.from(root.children),g=make('g');children[indices[0]].before(g);indices.forEach(i=>g.append(children[i]));return g}
 function rectReveal(element,delay,duration=800){const b=element.getBBox(),id='chart-clip-'+(++serial),clip=make('clipPath',{id,clipPathUnits:'userSpaceOnUse'}),rect=make('rect',{x:b.x-1,y:b.y+b.height,width:b.width+2,height:0});clip.append(rect);defs.append(clip);element.setAttribute('clip-path','url(#'+id+')');let token=0;return {reset(){++token;rect.setAttribute('y',b.y+b.height);rect.setAttribute('height',0)},run(){const current=++token,start=performance.now()+delay;return new Promise(resolve=>{function frame(t){if(current!==token){resolve();return}const p=reduced?1:Math.max(0,Math.min(1,(t-start)/duration)),v=1-Math.pow(1-p,3);rect.setAttribute('y',b.y+b.height*(1-v)-1);rect.setAttribute('height',(b.height+2)*v);if(p<1)requestAnimationFrame(frame);else resolve()}requestAnimationFrame(frame)})}}}
 function pieReveal(element,cx,cy,r){const id='chart-pie-'+(++serial),clip=make('clipPath',{id,clipPathUnits:'userSpaceOnUse'}),wedge=make('path');clip.append(wedge);defs.append(clip);element.setAttribute('clip-path',`url(#${id})`);let token=0;return {reset(){++token;wedge.setAttribute('d','')},run(){const current=++token,start=performance.now();return new Promise(resolve=>{function frame(t){if(current!==token){resolve();return}const p=reduced?1:Math.min(1,(t-start)/1000),angle=p*Math.PI*2-Math.PI/2,x=cx+Math.cos(angle)*r,y=cy+Math.sin(angle)*r;wedge.setAttribute('d',p>=1?`M${cx-r} ${cy-r}h${r*2}v${r*2}h${-r*2}Z`:`M${cx} ${cy}L${cx} ${cy-r}A${r} ${r} 0 ${p>.5?1:0} 1 ${x} ${y}Z`);if(p<1)requestAnimationFrame(frame);else resolve()}requestAnimationFrame(frame)})}}}
 for(const [name,ids,config]of [
  ['질문1-1',range(83,118),{pie:[10,11,12,13],labels:[14,15,35],bars:[[24],[25,27],[26,28],[31,32]],numbers:[21,22,23,30]}],
  ['질문2-2',range(119,151),{bubbles:[[6],[7],[8]],labels:[9,10,11],bars:[[19],[22,23],[26,27],[30,31]],numbers:[20,24,28,32]}],
  ['질문3-3',range(154,182),{pie:[14,15,16,17],labels:[18,19,20,21],bars:[],numbers:[]}]
 ]){
  // The third panel's background is at 151/152 and precedes its question type.
  const all=name==='질문3-3'?[152,153,...ids]:ids,anchor=name==='질문3-3'?152:ids[0];
  const r=await replace(name,[...new Set(all)],anchor),elements=Array.from(r.asset.children),motions=[];
  if(config.pie){const g=chartGroup(r.asset,config.pie),b=g.getBBox();motions.push(pieReveal(g,b.x+b.width/2,b.y+b.height/2,Math.max(b.width,b.height)))}
  if(config.bubbles)config.bubbles.forEach((indices,i)=>{const g=make('g');elements[indices[0]].before(g);indices.forEach(j=>g.append(elements[j]));motions.push(rectReveal(g,i*120))});
  config.bars.forEach((indices,i)=>{const g=make('g');elements[indices[0]].before(g);indices.forEach(j=>g.append(elements[j]));motions.push(rectReveal(g,i*120))});
  const labels=[...config.labels,...config.numbers].map(i=>elements[i]);let generation=0,animations=[];
  watchers.push(watch(r.box.y+180,r.box.height-180,()=>{const current=++generation;r.motion.dataset.state='filling';motions.forEach(m=>m.run());labels.forEach((e,i)=>{animations.push(animate(e,[{opacity:0},{opacity:1}],{duration:350,delay:650+(i%4)*100,fill:'both'}))});setTimeout(()=>{if(current===generation)r.motion.dataset.state='complete'},1250)},()=>{++generation;motions.forEach(m=>m.reset());animations.forEach(a=>a.cancel());animations=[];labels.forEach(e=>e.style.opacity='0');r.motion.dataset.state='waiting'}));motions.forEach(m=>m.reset());labels.forEach(e=>e.style.opacity='0');
 }
 for(const [name,ids,anchor,localIndex]of [
  ['페르소나1',[48,49,...range(202,209)],48,0],['페르소나2',[18,185,...range(194,201)],18,0],['페르소나3',[20,...range(186,193)],186,0]
 ]){const r=await replace(name,ids,anchor,localIndex);const hover=make('g',{class:'persona-hover'});r.asset.before(hover);hover.append(r.asset);r.motion.classList.add('persona-card');r.motion.setAttribute('tabindex','0');r.motion.setAttribute('role','img');r.motion.setAttribute('aria-label',name);enterMotion(r.motion,r.box.y,r.box.height,{delay:0})}
 // A separate reveal wrapper leaves hover scale and restrained sway independent.
 const solutions=[[731],[733,735],[732,734]].map((ids,i)=>{const g=group(ids,{'data-solution':i+1}),hover=make('g',{class:'solution-hover'});while(g.firstChild)hover.append(g.firstChild);g.append(hover);g.classList.add('solution-card');g.setAttribute('tabindex','0');const b=g.getBBox();g.style.opacity='0';return {g,b}});
 const dotted=group(range(64,68),{'data-part':'persona-solution-connector'}),clip=make('clipPath',{id:'solution-connector-clip',clipPathUnits:'userSpaceOnUse'}),clipRect=make('rect',{x:930,y:9760,width:60,height:0});clip.append(clipRect);defs.append(clip);dotted.setAttribute('clip-path','url(#solution-connector-clip)');let connectorAnimations=[];
 watchers.push(watch(9763,1050,()=>{connectorAnimations.forEach(a=>a.cancel());connectorAnimations=[animate(clipRect,[{height:'0px'},{height:'220px'}],{duration:550,easing:'ease-out',fill:'both'}),...solutions.map(({g},i)=>animate(g,[{opacity:0,transform:'translateY(35px)'},{opacity:1,transform:'translateY(0)'}],{duration:550,delay:550+i*90,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}))]},()=>{connectorAnimations.forEach(a=>a.cancel());clipRect.setAttribute('height',0);solutions.forEach(({g})=>g.style.opacity='0')}));
 // Two meteors travel along their own drawn direction and stop at the artwork.
 const meteors=[group(range(51,54),{'data-meteor':'left'}),group(range(8,11),{'data-meteor':'right'})];let meteorAnimations=[];
 watchers.push(watch(11620,1100,()=>{meteorAnimations.forEach(a=>a.cancel());meteorAnimations=meteors.map((e,i)=>animate(e,[{opacity:0,transform:'translate(-280px,-290px)'},{opacity:1,transform:'translate(0,0)'}],{duration:850,delay:i*850,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}))},()=>{meteorAnimations.forEach(a=>a.cancel());meteors.forEach(e=>e.style.opacity='0')}));meteors.forEach(e=>e.style.opacity='0');
 [37,38,42,43].forEach((i,k)=>{if(!reduced)animate(node(i),[{opacity:.45},{opacity:1},{opacity:.45}],{duration:4700+k*730,delay:-k*1300,iterations:Infinity,easing:'ease-in-out'})});
 // Each supplied mountain carries its own stars, behind the original hill.
 const mountains=[];for(const [name,ids,anchor,localIndex]of [['산1',[324,518,39],324,2],['산2',[325,41],325,1],['산3',[323,40],323,1]]){const r=await replace(name,ids,anchor,localIndex);const mountainClip=make('clipPath',{id:'clip-'+name,clipPathUnits:'userSpaceOnUse'});mountainClip.append(make('rect',{x:0,y:13750,width:1920,height:1275}));defs.append(mountainClip);const mountainWindow=make('g',{'clip-path':'url(#clip-'+name+')'});r.motion.before(mountainWindow);mountainWindow.append(r.motion);r.motion.setAttribute('data-mountain',name);r.motion.style.opacity='1';r.motion.style.transform='translateY(1300px)';Array.from(r.asset.querySelectorAll('circle')).forEach((star,i)=>{if(!reduced)animate(star,[{opacity:.6},{opacity:1},{opacity:.6}],{duration:6000+mountains.length*650+i*450,delay:-i*1100,iterations:Infinity,easing:'ease-in-out'})});mountains.push(r.motion)}let mountainAnimations=[];
 watchers.push(watch(13900,1250,()=>{mountainAnimations.forEach(a=>a.cancel());mountainAnimations=mountains.map((e,i)=>animate(e,[{transform:'translateY(1300px)'},{transform:'translateY(0)'}],{duration:1500,delay:i*230,easing:'cubic-bezier(.25,.1,.25,1)',fill:'both'}))},()=>mountainAnimations.forEach(a=>a.cancel())));
 node(601)?.remove();
}
