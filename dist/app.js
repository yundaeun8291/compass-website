import {setupFeatureVideos} from './feature-videos.js?v=10';
import {setupPlanningPlayer} from './planning-player.js?v=10';
import {setupRevisionMotion} from './revision-motion.js?v=10';
const NS='http://www.w3.org/2000/svg';
let assetSerial=0;
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
setupPlanningPlayer({node,make,watch,watchers});
// Fixed navigation uses the original outlined lettering and original coordinates.
const nav=document.querySelector('#gnb'),navSvg=make('svg',{viewBox:'677.387 28.387 564.226 53.4041',fill:'none','aria-hidden':'true'});
for(const i of range(742,748))navSvg.append(node(i));nav.append(navSvg);
const starts=[2212,11180,15882,21730],labels=['Planning','Branding','Design','Features'];
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
rabbit.style.transform='translate(1250px,0)';shadow.style.transform='translate(1250px,0)';bubble.style.opacity='0';
let rabbitAnimations=[],arrived=false,rabbitGeneration=0;
function arrival(){const generation=++rabbitGeneration;arrived=false;rabbitAnimations.forEach(a=>a.cancel());bubble.style.opacity='0';const motion=[{offset:0,transform:'translate(1250px,0)'},{offset:.19,transform:'translate(950px,-125px)'},{offset:.34,transform:'translate(740px,0)'},{offset:.52,transform:'translate(480px,-105px)'},{offset:.67,transform:'translate(300px,0)'},{offset:.83,transform:'translate(125px,-65px)'},{offset:1,transform:'translate(0,0)'}];const a=animate(rabbit,motion,{duration:2050,easing:'linear',fill:'both'});rabbitAnimations=[a,animate(shadow,motion.map(f=>({...f,transform:f.transform.replace(/,-?\d+px\)/,',0)')})),{duration:2050,easing:'linear',fill:'both'})];a.finished.then(()=>{if(generation!==rabbitGeneration)return;arrived=true;bubble.style.opacity='1';rabbitAnimations.push(animate(bubble,[{opacity:0,transform:'translateY(15px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,fill:'both'}))}).catch(()=>{})}
action(rabbit,'토끼 점프',()=>{if(!arrived)return;rabbitAnimations.push(animate(rabbit,[{transform:'translateY(0)'},{transform:'translateY(-115px)',offset:.45},{transform:'translateY(0)'}],{duration:700,easing:'cubic-bezier(.33,0,.67,1)'}),animate(shadow,[{opacity:1},{opacity:.35,offset:.45},{opacity:1}],{duration:700}))});
watchers.push(watch(14665,602,arrival,()=>{++rabbitGeneration;arrived=false;rabbitAnimations.forEach(a=>a.cancel());bubble.style.opacity='0'}));
// Features button: entry, arrow, left-to-right icon reveal, then explanation.
const envy=group(range(282,289),{'data-part':'envy-button'}),arrow=node(295),icons=group(range(290,294)),description=group([279,280]);
const clickText=make('text',{x:426,y:27032,'dominant-baseline':'middle','font-size':24,class:'click-label'});clickText.textContent='Click!';scene.append(clickText);
let envyDone=false,envyBusy=false,envyFloat,envyEntry,envyAvailable=false,envyGeneration=0;
arrow.style.opacity='0';icons.style.opacity='0';description.style.opacity='0';
const defs=svg.querySelector('defs'),arrowClip=make('clipPath',{id:'envy-arrow-clip',clipPathUnits:'userSpaceOnUse'}),arrowRect=make('rect',{x:410,y:27020,width:0,height:24});arrowClip.append(arrowRect);defs.append(arrowClip);arrow.setAttribute('clip-path','url(#envy-arrow-clip)');
const iconClip=make('clipPath',{id:'envy-icon-clip',clipPathUnits:'userSpaceOnUse'}),iconRect=make('rect',{x:770,y:26890,width:0,height:280});iconClip.append(iconRect);defs.append(iconClip);icons.setAttribute('clip-path','url(#envy-icon-clip)');
action(envy,'부러워 버튼 펼치기',async()=>{if(!envyAvailable||envyBusy||envyDone)return;const generation=envyGeneration;envyBusy=true;envy.setAttribute('aria-expanded','true');envyFloat?.cancel();clickText.style.opacity='0';arrow.style.opacity='1';const start=performance.now();await new Promise(resolve=>{function frame(t){if(generation!==envyGeneration){resolve();return}const p=reduced?1:Math.min(1,(t-start)/650);arrowRect.setAttribute('width',383*p);if(p<1)requestAnimationFrame(frame);else resolve()}requestAnimationFrame(frame)});if(generation!==envyGeneration)return;icons.style.opacity='1';const next=performance.now();await new Promise(resolve=>{function frame(t){if(generation!==envyGeneration){resolve();return}const p=reduced?1:Math.min(1,(t-next)/850),v=1-Math.pow(1-p,3);iconRect.setAttribute('width',980*v);if(p<1)requestAnimationFrame(frame);else resolve()}requestAnimationFrame(frame)});if(generation!==envyGeneration)return;description.style.opacity='1';await animate(description,[{transform:'translateY(28px)',opacity:0},{transform:'translateY(0)',opacity:1}],{duration:1200,easing:'ease-out',fill:'both'}).finished.catch(()=>{});if(generation!==envyGeneration)return;envyDone=true;envyBusy=false});hit(envy,327,26991,83,81);envy.setAttribute('aria-expanded','false');
function resetExplore(){++envyGeneration;envyDone=false;envyBusy=false;envyAvailable=false;envyEntry?.cancel();envyFloat?.cancel();description.getAnimations().forEach(a=>a.cancel());envy.style.opacity='0';envy.style.pointerEvents='none';envy.setAttribute('tabindex','-1');envy.setAttribute('aria-hidden','true');envy.setAttribute('aria-expanded','false');clickText.style.opacity='0';arrow.style.opacity='0';icons.style.opacity='0';description.style.opacity='0';arrowRect.setAttribute('width',0);iconRect.setAttribute('width',0);node(281).style.opacity='0'}
function revealExplore(){envyAvailable=true;node(281).style.opacity='1';envy.style.opacity='1';envy.style.pointerEvents='';envy.setAttribute('tabindex','0');envy.setAttribute('aria-hidden','false');clickText.style.opacity='1';envyEntry=animate(envy,[{opacity:0,transform:'translate(368px,27031px) scale(.55) translate(-368px,-27031px)'},{opacity:1,transform:'translate(368px,27031px) scale(1) translate(-368px,-27031px)'}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'});envyFloat=animate(envy,[{transform:'translateY(0)'},{transform:'translateY(-8px)'},{transform:'translateY(0)'}],{duration:2100,delay:650,iterations:Infinity,easing:'ease-in-out'})}
resetExplore();
// Align the final recorded envy icon with the existing white control.
const exploreOffset={x:9.3,y:74.4};node(278).setAttribute('transform',`translate(${exploreOffset.x},${exploreOffset.y})`);node(278).setAttribute('data-video-offset',`translate(${exploreOffset.x},${exploreOffset.y})`);node(278).setAttribute('data-offset-y',exploreOffset.y);node(281).setAttribute('transform',`translate(${exploreOffset.x},${exploreOffset.y})`);
const descriptionPosition=make('g');description.before(descriptionPosition);descriptionPosition.append(description);descriptionPosition.setAttribute('transform','translate(0,-10.6)');
// The independent Week 3 control belongs in the dark report section.
const week=make('g',{class:'week-trigger','data-part':'week3'}),weekScale=make('g',{class:'week-preview'});
const weekBox={x:node(648).getBBox().x-20,y:35487,w:355,h:355},weekArtwork=await importSvg('week3');
const weekImage=weekArtwork.querySelector('image'),weekImageUrl=weekImage.getAttributeNS('http://www.w3.org/1999/xlink','href')||weekImage.getAttribute('href');weekScale.append(make('image',{href:weekImageUrl,x:weekBox.x,y:weekBox.y,width:355,height:355}));week.append(weekScale);node(649).after(week);
// Reinsert each complete supplied mockup, including its caption. Align the
// phone geometry inside the SVG to the original phone, preserving all padding.
const mockups=[];
for(const [i,phoneId,captionId]of [[1,651,592],[2,652,596],[3,650,599]]){const original=node(phoneId),box=original.getBBox(),asset=await importSvg('목업'+i),reveal=make('g',{class:'mockup-reveal week-hidden','data-mockup':i,'aria-label':'마음 탐험 일지 목업 '+i,'aria-hidden':'true'}),hover=make('g',{class:'week-mockup-hover',tabindex:0,role:'img'});original.before(reveal);reveal.append(hover);hover.append(asset);const phone=Array.from(asset.children).find(e=>e.tagName==='g'),local=phone.getBBox();asset.setAttribute('x',box.x-local.x);asset.setAttribute('y',box.y-local.y);original.remove();node(captionId).remove();mockups.push(reveal)}
const weekHint=await importSvg('week3 어포던스'),weekHintMotion=make('g',{'data-part':'week3-hint','pointer-events':'none'});weekHint.setAttribute('x',weekBox.x+18);weekHint.setAttribute('y',weekBox.y+weekBox.h+45);weekHintMotion.append(weekHint);week.after(weekHintMotion);if(!reduced)animate(weekHintMotion,[{transform:'translateY(0)'},{transform:'translateY(-6px)'},{transform:'translateY(0)'}],{duration:2100,iterations:Infinity,easing:'ease-in-out'});
let weekOpen=false,weekGeneration=0;
action(week,'Week 3 마음 탐험 일지 열기',()=>{weekOpen=!weekOpen;weekHintMotion.style.opacity=weekOpen?'0':'1';if(weekOpen&&scrollY/scale>35138&&scrollY/scale<36300)window.scrollTo({top:35138*scale,behavior:reduced?'instant':'smooth'});week.setAttribute('aria-expanded',String(weekOpen));const generation=++weekGeneration;mockups.forEach((g,i)=>{const hidden=g.classList.contains('week-hidden'),computed=getComputedStyle(g),from={opacity:hidden?0:computed.opacity,transform:hidden?'translateX(-42px)':computed.transform};g.getAnimations().forEach(a=>a.cancel());g.classList.remove('week-hidden');g.setAttribute('aria-hidden',String(!weekOpen));g.style.pointerEvents=weekOpen?'':'none';const opening=weekOpen;animate(g,[from,{opacity:opening?1:0,transform:opening?'translateX(0)':'translateX(-42px)'}],{duration:opening?430:330,delay:reduced?0:opening?i*105:(2-i)*65,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}).finished.then(()=>{if(generation!==weekGeneration)return;g.style.opacity=opening?'1':'0';if(!opening)g.classList.add('week-hidden')}).catch(()=>{})})});hit(week,weekBox.x,weekBox.y,weekBox.w,weekBox.h);week.setAttribute('aria-expanded','false');
// Record hover images are in the same original slots; no base geometry changes.
async function importSvg(name){let s=await fetch('assets/'+name+'.svg?v=10').then(r=>{if(!r.ok)throw Error('SVG unavailable: '+name);return r.text()});s=s.replaceAll('../images/','images/');const doc=new DOMParser().parseFromString(s,'image/svg+xml'),root=doc.documentElement,prefix='asset-'+(++assetSerial)+'-';const ids=Array.from(root.querySelectorAll('[id]')).map(e=>e.id);for(const id of ids)s=s.replaceAll(id,prefix+id);return new DOMParser().parseFromString(s,'image/svg+xml').documentElement}
// The supplied Design blocks preserve their original anchor and native size.
for(const [name,ids,anchor]of [
 ['디자인 글씨',[309,310],309],
 ['디자인 아이콘',[308,...range(311,322),326,327,328,329,...range(564,586)],308],
 ['디자인 타이포그래피',range(330,336),330],
 ['디자인 타이포그래피 2',range(337,342),337],
 ['디자인 아이콘그래피',range(364,511),364],
 ['디자인 컬러',range(343,363),343]
]){const old=node(anchor),box=old.getBBox(),asset=await importSvg(name),motion=make('g',{'data-design':name});old.before(motion);motion.append(asset);const local=asset.firstElementChild.getBBox();asset.setAttribute('x',box.x-local.x);asset.setAttribute('y',box.y-local.y);ids.forEach(i=>node(i).remove());const finalBox=motion.getBBox();motion.style.opacity='0';let animation;watchers.push(watch(finalBox.y,finalBox.height,()=>{animation?.cancel();animation=animate(motion,[{opacity:0,transform:'translateY(32px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'})},()=>{animation?.cancel();motion.style.opacity='0'}))}
// Tree paint order stays behind the tent. Each of the four moves only upward
// to its exact original path coordinates, with no overshoot or rebound.
const trees=[],treeClip=make('clipPath',{id:'tent-tree-clip',clipPathUnits:'userSpaceOnUse'});treeClip.append(make('rect',{x:0,y:20736,width:1920,height:1911}));defs.append(treeClip);
for(const [i,id]of [[1,243],[2,241],[3,242],[4,244]]){const old=node(id),asset=await importSvg('나무'+i),container=make('g',{'clip-path':'url(#tent-tree-clip)'}),motion=make('g',{'data-tree':i});old.before(container);container.append(motion);motion.append(asset);const firstMove=p=>p.getAttribute('d').match(/^M\s*([\d.-]+)[ ,]+([\d.-]+)/).slice(1).map(Number),[ox,oy]=firstMove(old),[nx,ny]=firstMove(asset.firstElementChild);asset.setAttribute('x',ox-nx);asset.setAttribute('y',oy-ny);old.remove();motion.style.transform='translateY(2000px)';trees.push(motion)}
let treeAnimations=[];watchers.push(watch(20736,1911,()=>{treeAnimations.forEach(a=>a.cancel());treeAnimations=trees.map((e,i)=>animate(e,[{transform:'translateY(2000px)'},{transform:'translateY(0)'}],{duration:380,delay:reduced?0:i*80,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}))},()=>treeAnimations.forEach(a=>a.cancel())));
for(const [ids,x,y,w,h,name,back]of [[range(695,701),119,37032,1680,517,'카드1',null],[range(702,714),119,37569,831,524,'카드2','카드2-1'],[range(715,727),970,37569,829,524,'카드3','카드3-1']]){const old=ids.map(node),card=make('g',{class:'interactive record-card'+(!back?' no-back':''),tabindex:0,role:'img','aria-label':name==='카드1'?'모닥불로 성장 확인하기':name==='카드2'?'작은 실천이 쌓이는 과정':'하루의 실천을 돌아보는 성장 기록'}),hover=make('g',{class:'hover-scale'});old[0].before(card);old.forEach(e=>e.remove());for(const [file,cls]of [[name,'record-front'],...(back?[[back,'record-back']]:[])]){const asset=await importSvg(file);for(const[k,v]of Object.entries({x,y,width:w,height:h}))asset.setAttribute(k,v);asset.classList.add(cls);hover.append(asset)}card.append(hover);hit(card,x,y,w,h)}
// Replace the entire My Page block, anchored to its original heading.
const myPageIds=[275,276,277,589,590,694,728],oldHeading=node(275).getBBox(),myPage=await importSvg('마이페이지');
node(275).before(myPage);const newHeading=myPage.firstElementChild.getBBox();myPage.setAttribute('x',oldHeading.x+oldHeading.width/2-newHeading.x-newHeading.width/2);myPage.setAttribute('y',oldHeading.y-newHeading.y);myPage.setAttribute('data-part','my-page');myPageIds.forEach(i=>node(i).remove());
// Two complete supplied footer states occupy the same original footer origin.
range(210,239).forEach(i=>node(i).remove());
const footerStates=[];
for(const [name,indices,label]of [['푸터1',[29,30],'Credits & Resources'],['푸터2',[22,23],'Back to Team']]){const asset=await importSvg(name);asset.setAttribute('x',0);asset.setAttribute('y',40301);asset.setAttribute('data-footer',footerStates.length===0?'team':'credits');scene.append(asset);const items=Array.from(asset.children),link=make('g',{class:'footer-link'});items[indices[0]].before(link);indices.forEach(i=>link.append(items[i]));const box=link.getBBox(),visual=make('g',{class:'footer-link-visual'});while(link.firstChild)visual.append(link.firstChild);link.append(visual);hit(link,box.x-5,box.y-5,box.width+10,box.height+10);action(link,label,()=>{const showCredits=label==='Credits & Resources';footerStates.forEach((state,i)=>{const visible=i===(showCredits?1:0);state.style.display=visible?'':'none';state.setAttribute('aria-hidden',String(!visible))});});footerStates.push(asset)}
footerStates[1].style.display='none';footerStates[1].setAttribute('aria-hidden','true');footerStates[0].setAttribute('aria-hidden','false');
svg.setAttribute('viewBox','0 0 1920 41039');svg.setAttribute('height',41039);node(0).setAttribute('height',41039);svg.querySelector('#clip0_588_11739 rect').setAttribute('height',41039);
// Exact replacement for the Features introduction, using its heading anchor.
const featureIntro=await importSvg('웹 기능쪽 목업'),featureAnchor=node(512).getBBox();node(512).before(featureIntro);const featureLocal=featureIntro.firstElementChild.getBBox();featureIntro.setAttribute('x',featureAnchor.x-featureLocal.x);featureIntro.setAttribute('y',featureAnchor.y-featureLocal.y);featureIntro.setAttribute('data-part','features-intro');range(512,517).forEach(i=>node(i).remove());
const onboarding=await importSvg('온보딩 수정'),onboardingBox=node(260).getBBox(),onboardingPath=onboarding.firstElementChild;node(260).before(onboarding);const onboardingLocal=onboardingPath.getBBox();onboarding.setAttribute('x',onboardingBox.x+onboardingBox.width/2-onboardingLocal.x-onboardingLocal.width/2);onboarding.setAttribute('y',onboardingBox.y-onboardingLocal.y);onboarding.setAttribute('data-part','onboarding-label');[260,261,262].forEach(i=>node(i).remove());
// The strip's original crop moves into the surrounding panel's left/right edge.
node(643).setAttribute('transform','translate(8,0)');node(643).setAttribute('data-part','compass-card-strip');
await setupRevisionMotion({svg,scene,node,make,group,range,importSvg,animate,watch,watchers,reduced});
await setupFeatureVideos({svg,node,make,watch,watchers,myPage,onExploreStart:resetExplore,onExploreEnd:revealExplore,onExploreLeave:resetExplore});
// Fixed TOP control uses the original circle and lettering on every section.
const topButton=document.createElement('button'),topSvg=make('svg',{viewBox:'1805 978 65 65',fill:'none','aria-hidden':'true'});topButton.id='top-button';topButton.type='button';topButton.setAttribute('aria-label','맨 위로');[815,816,817].forEach(i=>topSvg.append(node(i)));topButton.append(topSvg);document.body.append(topButton);topButton.addEventListener('click',()=>window.scrollTo({left:0,top:0,behavior:'smooth'}));
// Short, bounded DOM effects: movement-only fireflies and click ripples.
let lastMove=0;
window.addEventListener('pointermove',e=>{const y=(scrollY+e.clientY)/scale;if(y<11180||y>=22208)return;const now=performance.now();if(now-lastMove<22)return;lastMove=now;const dot=document.createElement('i');dot.className='trail';dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';dot.style.transform='translate(-50%,-50%)';effects.append(dot);dot.addEventListener('animationend',()=>dot.remove(),{once:true})},{passive:true});
document.addEventListener('click',e=>{if(e.target.closest('#gnb'))return;const y=(scrollY+(e.clientY||0))/scale;if(y<11180||y>=40301||e.detail===0)return;for(let i=0;i<2;i++){const wave=document.createElement('i');wave.className='wave';wave.style.left=e.clientX+'px';wave.style.top=e.clientY+'px';wave.style.animationDelay=i*65+'ms';effects.append(wave);wave.addEventListener('animationend',()=>wave.remove(),{once:true})}});
// One gentle alignment per entry, after user scrolling has settled. Any new
// wheel, touch or key input cancels it; there is no mandatory scroll snapping.
let alignTimer,weekAligned=false,lastScrollY=scrollY,aligning=false;
function settleWeek(){clearTimeout(alignTimer);const y=scrollY/scale;if(y<34850||y>36550)weekAligned=false;if(weekAligned||aligning||y<35040||y>35580)return;alignTimer=setTimeout(()=>{const now=scrollY/scale;if(now<35040||now>35580||weekAligned)return;weekAligned=true;aligning=true;window.scrollTo({top:35138*scale,behavior:reduced?'instant':'smooth'});setTimeout(()=>aligning=false,650)},360)}
window.addEventListener('scroll',settleWeek,{passive:true});['wheel','touchstart','keydown'].forEach(type=>window.addEventListener(type,()=>{clearTimeout(alignTimer);if(aligning){aligning=false;window.scrollTo({top:scrollY,behavior:'instant'})}},{passive:true}));
let scheduled=false;function update(){updateNav();watchers.forEach(fn=>fn());scheduled=false}window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}},{passive:true});window.addEventListener('resize',resize);resize();
document.documentElement.dataset.ready='true';
