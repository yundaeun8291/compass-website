const NS='http://www.w3.org/2000/svg';
const art=document.querySelector('#art');
const effects=document.querySelector('#effects');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const svgText=await fetch('art.svg').then(r=>{if(!r.ok)throw Error('Artwork unavailable');return r.text()});
art.innerHTML=svgText;
const svg=art.querySelector('svg'),scene=svg.firstElementChild;
svg.setAttribute('role','group');svg.setAttribute('aria-label','COMPASS: Planning, Branding, Design, Features');
const node=i=>scene.querySelector(`[data-i="${i}"]`);
const make=(tag,attrs={})=>{const e=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);return e};
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
function group(ids,attrs={}){const elements=ids.map(node),g=make('g',attrs);elements[0].before(g);elements.forEach(e=>g.append(e));return g}
function action(g,label,fn){g.classList.add('interactive');g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',label);g.addEventListener('click',fn);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();g.dispatchEvent(new MouseEvent('click',{bubbles:true}))}});return g}
function hit(g,x,y,w,h){g.append(make('rect',{class:'hit',x,y,width:w,height:h}));}
function animate(e,frames,options){return e.animate(frames,{...options,duration:reduced?1:options.duration})}
function watch(y,height,enter,leave=()=>{}){let inside=false;return ()=>{const top=scrollY/scale,bottom=(scrollY+innerHeight)/scale;const next=bottom>y+Math.min(height*.15,150)&&top<y+height;if(next&&!inside)enter();if(!next&&inside)leave();inside=next}}
let scale=1;const watchers=[];
function resize(){scale=Math.max(1024,document.documentElement.clientWidth)/1920;document.documentElement.style.setProperty('--scale',scale);update()}
// Fixed navigation uses the original outlined lettering and original coordinates.
const nav=document.querySelector('#gnb'),navSvg=make('svg',{viewBox:'677.387 28.387 564.226 53.4041',fill:'none','aria-hidden':'true'});
for(const i of range(742,748))navSvg.append(node(i));nav.append(navSvg);
const starts=[2212,11180,16022,21870],labels=['Planning','Branding','Design','Features'];
let current=-2;
const navCenters=range(745,748).map(i=>{const b=navSvg.querySelector(`[data-i="${i}"]`).getBBox();return b.x+b.width/2});
labels.forEach((label,i)=>{const b=document.createElement('button');b.ariaLabel=label;b.style.left=`${(navCenters[i]-125.384/2-677.387)/564.226*100}%`;b.onclick=()=>window.scrollTo({top:starts[i]*scale,behavior:'smooth'});nav.append(b)});
function updateNav(){const y=scrollY/scale+2;let active=-1;starts.forEach((s,i)=>{if(y>=s)active=i});if(active===current)return;current=active;const pill=navSvg.querySelector('[data-i="744"]');pill.style.opacity=active<0?'0':'1';if(active>=0)pill.style.transform=`translateX(${navCenters[active]-navCenters[0]}px)`;range(745,748).forEach((n,i)=>navSvg.querySelector(`[data-i="${n}"]`).setAttribute('fill',i===active?'#F9F9F9':'#DFDFE5'));Array.from(nav.querySelectorAll('button')).forEach((b,i)=>{if(active===i)b.setAttribute('aria-current','location');else b.removeAttribute('aria-current')})}
// The five landscape layers retain their path geometry and stacking order.
const terrain=node(55),terrainChildren=Array.from(terrain.children),landLayers=[];
for(const ids of [[0],[1],[2],[3,4,5,6,7,8],[9,10,11,12,13]]){const g=make('g');terrainChildren[ids[0]].before(g);ids.forEach(i=>g.append(terrainChildren[i]));landLayers.push(g)}
let landAnimations=[];
watchers.push(watch(11180,700,()=>{landAnimations.forEach(a=>a.cancel());landAnimations=landLayers.map((g,i)=>animate(g,[{transform:'translateY(130px)',opacity:0},{transform:'translateY(0)',opacity:1}],{duration:1050,delay:reduced?0:i*150,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}))},()=>{landAnimations.forEach(a=>a.cancel())}));
// Naming cards: original paths, independent float and hover transforms.
[[612,618],[619,623],[624,628],[635,639]].forEach(([a,b],i)=>{const outer=group(range(a,b),{class:'naming-card interactive',tabindex:0,role:'img','aria-label':['마음 나침반','반딧불','지도 만들기','베이스캠프'][i]});const drift=make('g',{class:'naming-drift',style:`--period:${4.7+i*.45}s;--delay:${-i*.9}s`}),hover=make('g',{class:'naming-hover'});while(outer.firstChild)hover.append(outer.firstChild);drift.append(hover);outer.append(drift)});
// Rabbit arrival moves the complete, fixed running pose; clicking only jumps.
const rabbit=group(range(685,693),{'data-part':'rabbit'}),shadow=node(520),bubble=group(range(644,646));
let rabbitAnimations=[],arrived=false,rabbitGeneration=0;
function arrival(){const generation=++rabbitGeneration;arrived=false;rabbitAnimations.forEach(a=>a.cancel());bubble.style.opacity='0';const motion=[{offset:0,transform:'translate(1250px,0)'},{offset:.19,transform:'translate(950px,-125px)'},{offset:.34,transform:'translate(740px,0)'},{offset:.52,transform:'translate(480px,-105px)'},{offset:.67,transform:'translate(300px,0)'},{offset:.83,transform:'translate(125px,-65px)'},{offset:1,transform:'translate(0,0)'}];const a=animate(rabbit,motion,{duration:2050,easing:'linear',fill:'both'});rabbitAnimations=[a,animate(shadow,motion.map(f=>({...f,transform:f.transform.replace(/,-?\d+px\)/,',0)')})),{duration:2050,easing:'linear',fill:'both'})];a.finished.then(()=>{if(generation!==rabbitGeneration)return;arrived=true;bubble.style.opacity='1';rabbitAnimations.push(animate(bubble,[{opacity:0,transform:'translateY(15px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,fill:'both'}))}).catch(()=>{})}
action(rabbit,'토끼 점프',()=>{if(!arrived)return;rabbitAnimations.push(animate(rabbit,[{transform:'translateY(0)'},{transform:'translateY(-115px)',offset:.45},{transform:'translateY(0)'}],{duration:700,easing:'cubic-bezier(.33,0,.67,1)'}),animate(shadow,[{opacity:1},{opacity:.35,offset:.45},{opacity:1}],{duration:700}))});
watchers.push(watch(14665,602,arrival,()=>{++rabbitGeneration;arrived=false;rabbitAnimations.forEach(a=>a.cancel());bubble.style.opacity='0'}));
// Features button: entry, arrow, right-to-left icon reveal, then explanation.
const envy=group(range(282,289),{'data-part':'envy-button'}),arrow=node(295),icons=group(range(290,294)),description=group([279,280]);
const clickText=make('text',{x:368.447,y:27097,'text-anchor':'middle','font-size':24,class:'click-label'});clickText.textContent='Click!';scene.append(clickText);
let envyDone=false,envyBusy=false,envyFloat,envyEntry;
arrow.style.opacity='0';icons.style.opacity='0';description.style.opacity='0';
const defs=svg.querySelector('defs'),arrowClip=make('clipPath',{id:'envy-arrow-clip',clipPathUnits:'userSpaceOnUse'}),arrowRect=make('rect',{x:410,y:27020,width:0,height:24});arrowClip.append(arrowRect);defs.append(arrowClip);arrow.setAttribute('clip-path','url(#envy-arrow-clip)');
const iconClip=make('clipPath',{id:'envy-icon-clip',clipPathUnits:'userSpaceOnUse'}),iconRect=make('rect',{x:1750,y:26890,width:0,height:280});iconClip.append(iconRect);defs.append(iconClip);icons.setAttribute('clip-path','url(#envy-icon-clip)');
action(envy,'부러워 버튼 펼치기',async()=>{if(envyBusy||envyDone)return;envyBusy=true;envy.setAttribute('aria-expanded','true');envyFloat?.cancel();clickText.style.opacity='0';arrow.style.opacity='1';const start=performance.now();await new Promise(resolve=>{function frame(t){const p=reduced?1:Math.min(1,(t-start)/650);arrowRect.setAttribute('width',383*p);if(p<1)requestAnimationFrame(frame);else resolve()}requestAnimationFrame(frame)});icons.style.opacity='1';const next=performance.now();await new Promise(resolve=>{function frame(t){const p=reduced?1:Math.min(1,(t-next)/850),v=1-Math.pow(1-p,3);iconRect.setAttribute('x',1750-980*v);iconRect.setAttribute('width',980*v);if(p<1)requestAnimationFrame(frame);else resolve()}requestAnimationFrame(frame)});description.style.opacity='1';await animate(description,[{transform:'translateY(28px)',opacity:0},{transform:'translateY(0)',opacity:1}],{duration:550,easing:'ease-out',fill:'both'}).finished;envyDone=true;envyBusy=false});hit(envy,327,26991,83,81);envy.setAttribute('aria-expanded','false');
watchers.push(watch(26431,852,()=>{if(envyDone||envyBusy)return;envyEntry?.cancel();envyEntry=animate(envy,[{opacity:0,transform:'translate(368px,27031px) scale(.55) translate(-368px,-27031px)'},{opacity:1,transform:'translate(368px,27031px) scale(1) translate(-368px,-27031px)'}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'});envyFloat=animate(envy,[{transform:'translateY(0)'},{transform:'translateY(-8px)'},{transform:'translateY(0)'}],{duration:2100,delay:650,iterations:Infinity,easing:'ease-in-out'})},()=>{envyFloat?.cancel()}));
// Week 3 is embedded in the original phone raster. Crop that exact raster for
// a hover layer, preserving its pixels and its original position.
const homePhone=node(647),week=make('g',{class:'week-trigger','data-part':'week3'}),weekScale=make('g',{class:'week-preview'});
const weekBox={x:525+85*412/844,y:33973+941*832/1704,w:325*412/844,h:324*832/1704};
weekScale.append(make('image',{href:'images/week3-original-crop.png',x:weekBox.x,y:weekBox.y,width:weekBox.w,height:weekBox.h}));week.append(weekScale);homePhone.after(week);
const mockups=[group([651,592]),group([652,596]),group([650,599])];mockups.forEach(g=>{g.classList.add('mockup-reveal','week-hidden');g.setAttribute('aria-hidden','true')});
let weekOpen=false,weekGeneration=0;
action(week,'Week 3 마음 탐험 일지 열기',()=>{weekOpen=!weekOpen;week.setAttribute('aria-expanded',String(weekOpen));const generation=++weekGeneration;mockups.forEach((g,i)=>{g.getAnimations().forEach(a=>a.cancel());g.classList.toggle('week-hidden',!weekOpen);g.setAttribute('aria-hidden',String(!weekOpen));if(weekOpen){g.style.opacity='0';animate(g,[{opacity:0,transform:'translateY(35px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:reduced?0:i*210,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}).finished.then(()=>{if(generation===weekGeneration)g.style.opacity='1'}).catch(()=>{})}else g.style.opacity='0'})});hit(week,weekBox.x,weekBox.y,weekBox.w,weekBox.h);week.setAttribute('aria-expanded','false');
// Record hover images are in the same original slots; no base geometry changes.
async function importSvg(name){let s=await fetch('assets/'+name+'.svg').then(r=>r.text());s=s.replaceAll('../images/','images/');const doc=new DOMParser().parseFromString(s,'image/svg+xml'),root=doc.documentElement,prefix='asset-'+name+'-';const ids=Array.from(root.querySelectorAll('[id]')).map(e=>e.id);for(const id of ids)s=s.replaceAll(id,prefix+id);return new DOMParser().parseFromString(s,'image/svg+xml').documentElement}
for(const [ids,x,y,w,h,back]of [[range(695,701),119,37032,1680,517,null],[range(702,714),119,37569,831,524,'카드2-1'],[range(715,727),970,37569,829,524,'카드3-1']]){const card=group(ids,{class:'record-card'+(!back?' no-back':''),tabindex:0,role:'img','aria-label':back?'Record 카드 호버 이미지':'Record 카드'}),hover=make('g',{class:'hover-scale'}),front=make('g',{class:'record-front'});while(card.firstChild)front.append(card.firstChild);hover.append(front);if(back){const alt=await importSvg(back);alt.setAttribute('x',x);alt.setAttribute('y',y);alt.setAttribute('width',w);alt.setAttribute('height',h);alt.classList.add('record-back');hover.append(alt)}card.append(hover);hit(card,x,y,w,h)}
// Original TOP artwork remains at its original coordinates.
const topButton=group([815,816,817]);action(topButton,'맨 위로',()=>window.scrollTo({top:0,behavior:'smooth'}));
// Short, bounded DOM effects: movement-only fireflies and click ripples.
let lastMove=0;
window.addEventListener('pointermove',e=>{const y=(scrollY+e.clientY)/scale;if(y<11180||y>=22208)return;const now=performance.now();if(now-lastMove<22)return;lastMove=now;const dot=document.createElement('i');dot.className='trail';dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';dot.style.transform='translate(-50%,-50%)';effects.append(dot);dot.addEventListener('animationend',()=>dot.remove(),{once:true})},{passive:true});
document.addEventListener('click',e=>{const y=(scrollY+(e.clientY||0))/scale;if(y<11180||y>=40301)return;for(let i=0;i<3;i++){const wave=document.createElement('i');wave.className='wave';wave.style.left=e.clientX+'px';wave.style.top=e.clientY+'px';wave.style.transform='translate(-50%,-50%)';wave.style.animationDelay=i*95+'ms';effects.append(wave);wave.addEventListener('animationend',()=>wave.remove(),{once:true})}});
let scheduled=false;function update(){updateNav();watchers.forEach(fn=>fn());scheduled=false}window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}},{passive:true});window.addEventListener('resize',resize);resize();
document.documentElement.dataset.ready='true';
