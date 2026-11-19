import {mountFeatures} from './capstone-features.js?v=18';
export const legacyOffset = 4195;
const detailStart = 45151;
export const sectionStarts = [2212, 11918, 18598, 25925];
const easing = 'cubic-bezier(.22,1,.36,1)';
const range = (start, end) => Array.from({length:end-start+1}, (_, i)=>start+i);

export async function mountCapstone({svg, legacy, player, make, watch, watchers, reduced, artwork, action, hit, importSvg}) {
  const markup = artwork ?? await fetch('capstone/art.svg').then(response => {
    if (!response.ok) throw Error('Capstone artwork unavailable');
    return response.text();
  });
  const documentSvg = new DOMParser().parseFromString(markup, 'image/svg+xml').documentElement;
  const source = documentSvg.firstElementChild;
  const parts = [...source.children];
  // Both exports use Figma's generated IDs. Keep all references isolated.
  const ids = new Set([...documentSvg.querySelectorAll('[id]')].map(element=>element.id));
  for (const element of documentSvg.querySelectorAll('*')) {
    if (element.id) element.id = 'capstone-'+element.id;
    for (const {name,value,namespaceURI} of [...element.attributes]) {
      if (!value.includes('#') || value.startsWith('data:')) continue;
      const next = value.replace(/#([\w.-]+)/g, (match,id)=>ids.has(id)?'#capstone-'+id:match);
      if (next!==value) element.setAttributeNS(namespaceURI,name,next);
    }
  }
  const defs = documentSvg.querySelector('defs');
  const clip = (name, attributes) => {
    const path = make('clipPath',{id:'capstone-'+name});
    path.append(make('rect',attributes));
    defs.append(path);
    return 'url(#capstone-'+name+')';
  };
  const upper = make('g',{'clip-path':clip('upper',{width:1920,height:detailStart})});
  const lower = make('g',{'clip-path':clip('lower',{y:detailStart,width:1920,height:20000})});
  const shifted = make('g',{transform:'translate(0 '+4850+')'});
  const height = 45889;
  svg.setAttribute('viewBox','0 0 1920 '+height);
  svg.setAttribute('height',height);
  svg.append(defs,upper,lower);
  upper.append(source);
  lower.append(shifted);
  shifted.append(...legacy.querySelectorAll('[data-footer]'));
  const part = id => parts[id];
  const groupElements = (elements, attributes={}) => {
    const g=make('g',attributes);
    elements[0].before(g);
    g.append(...elements);
    return g;
  };
  const group = (numbers, attributes) => groupElements(numbers.map(part), attributes);
  const move = (element, frames, options) => element.animate(frames, options);
  function visibility(y,height,enter,leave=()=>{}) {
    watchers.push(watch(y,height,enter,leave,true));
  }
  function reveal(element,y,height,{duration=700,delay=0,distance=28,from=0}={}) {
    if (reduced) return;
    let animation;
    element.style.opacity=from;
    visibility(y,height,()=>{
      animation?.cancel();
      animation=move(element,[{opacity:from,transform:'translateY('+distance+'px)'},{opacity:1,transform:'translateY(0)'}],{duration,delay,easing,fill:'both'});
    },()=>animation?.cancel());
  }
  function rise(ids,name,options) {
    const g=group(ids,{'data-capstone':name});
    const b=g.getBBox();
    reveal(g,b.y,b.height,options);
    return g;
  }
  async function replaceArtwork(name,ids,x,y) {
    const asset=await importSvg('capstone-'+name);
    asset.setAttribute('x',x);
    asset.setAttribute('y',y);
    part(ids[0]).before(asset);
    ids.forEach(id=>part(id).remove());
    return asset;
  }
  function sequence(items,y,height) {
    if (reduced) return;
    let running=[];
    for (const {element,frames} of items) Object.assign(element.style,frames[0]);
    visibility(y,height,()=>{
      running.forEach(a=>a.cancel());
      running=items.map(({element,frames,options})=>move(element,frames,{fill:'both',easing,...options}));
    },()=>running.forEach(a=>a.cancel()));
  }
  function drift(element,amplitude,period,phase) {
    if (reduced) return;
    move(element,[{transform:'translateY(0)'},{transform:'translateY('+amplitude+'px)'},{transform:'translateY(0)'}],
      {duration:period,delay:phase,easing:'ease-in-out',iterations:Infinity});
  }
  function twinkle(element,index) {
    if (reduced) return;
    const opacity=Number(element.getAttribute('fill-opacity')??1);
    move(element,[{opacity:opacity*.45},{opacity},{opacity:opacity*.45}],
      {duration:5600+index*730, delay:-index*1250, iterations:Infinity,easing:'ease-in-out'});
  }

  // The intro keeps the original foreignObject, player state and coordinates.
  part(37).after(player);
  legacy.remove();
  [38,39,...range(985,991),...range(1029,1031)].forEach(id=>part(id).remove());

  [1020,1021].forEach((id,i)=>{
    part(id).dataset.heroPhone=String(i+1);
    drift(part(id),i?18:-18,2100,i?-340:0);
  });
  [range(992,1001),range(1002,1007),[1008,1009],[1010,1011],range(1012,1019),range(1022,1028)].forEach((ids,i)=>{
    drift(group(ids,{'data-hero-decoration':i+1}),-10-i%3,6600+i*750,-i*1240);
  });

  const overview = groupElements([...part(15).children].filter(element=>element.tagName==='path'),{'data-capstone':'overview'});
  reveal(overview,3432,250);
  for (const [ids,name] of [[range(45,51),'survey'],[range(702,704),'survey-1'],[range(741,743),'survey-2'],[[777,778,810],'survey-3'],[[11,12],'insight'],[[13,14],'solution-heading'],[range(350,352),'naming-heading'],[[487,488,489],'character-heading']]) rise(ids,name);

  function animatePie(ids, labelIds, size, y) {
    if (reduced) return;
    const chart=group(ids);
    const {x,y:top,width,height}=chart.getBBox();
    const cx=x+width/2,cy=top+height/2;
    const ring=make('circle',{cx,cy,r:size/2,'pathLength':100,'fill':'none',stroke:'white','stroke-width':size});
    const mask=make('mask',{id:'capstone-pie-'+ids[0],maskUnits:'userSpaceOnUse',x,y:top,width,height});
    mask.append(ring);defs.append(mask);
    chart.setAttribute('mask','url(#'+mask.id+')');
    sequence([{element:ring,frames:[{strokeDasharray:'0 100'},{strokeDasharray:'100 0'}],options:{duration:1000,easing:'linear'}},
      ...labelIds.map(id=>({element:part(id),frames:[{opacity:0},{opacity:1}],options:{duration:250,delay:650}}))],y,400);
  }
  animatePie(range(714,717),range(718,720),300,5700);
  animatePie(range(790,793),range(794,797),300,8010);
  const bubbles = [[747,750],[748,751],[749,752]].map((ids,i)=>{
    const element=group(ids);
    element.style.transformBox='fill-box';element.style.transformOrigin='center';
    return {element,frames:[{opacity:0,transform:'scale(0)'},{opacity:1,transform:'scale(1)'}],options:{duration:360,delay:i*210}};
  });
  sequence(bubbles,6920,370);
  function animateBars(bars, labels, y, horizontal) {
    const items=bars.map((ids,i)=>{
      const element=group(ids);
      element.style.transformBox='fill-box';element.style.transformOrigin=horizontal?'left center':'center bottom';
      return {element,frames:[{transform:horizontal?'scaleX(0)':'scaleY(0)'},{transform:'scale(1)'}],
        options:{duration:horizontal?420:800,delay:i*(horizontal?160:120)}};
    });
    labels.forEach((id,i)=>items.push({element:part(id),frames:[{opacity:0},{opacity:1}],
      options:{duration:250,delay:horizontal?350+i*160:650+i*100}}));
    sequence(items,y,390);
  }
  animateBars([[727],[730,731],[734,735],[738,739]],[726,729,733,737],5730,false);
  animateBars([[763],[766,767],[770,771],[774,775]],[764,768,772,776],6920,true);
  rise(range(801,809),'survey-feedback');

  for (const ids of [range(76,85),range(66,75),range(57,65)]) {
    const persona=rise(ids,'persona');
    groupElements([...persona.children],{class:'persona-hover'});
    persona.classList.add('persona-card');
    persona.setAttribute('tabindex','0');
  }
  const solutionMarkup=await fetch('capstone/solution.svg').then(response=>{
    if (!response.ok) throw Error('Solution artwork unavailable');
    return response.text();
  });
  const solutionArt=new DOMParser().parseFromString(solutionMarkup,'image/svg+xml').documentElement;
  solutionArt.setAttribute('y',10940);
  solutionArt.setAttribute('pointer-events','none');
  part(377).before(solutionArt);
  range(377,384).forEach(id=>part(id).remove());
  const [,,,rightCard,rightTape,centerCard,centerTape]=solutionArt.children;
  const [,,,,,,leftCard,leftTape]=centerCard.children;
  centerCard.before(leftCard,leftTape);
  [[leftCard,leftTape],[centerCard,centerTape],[rightCard,rightTape]].forEach(([card,tape],i)=>{
    const target=card.firstElementChild.cloneNode(false);
    target.setAttribute('fill','transparent');
    target.setAttribute('pointer-events','all');
    const motion=groupElements([card,tape],{class:'solution-hover'});
    const element=groupElements([motion],{class:'solution-card',tabindex:0,'data-solution':i+1});
    element.append(target);
    reveal(element,10566,1150,{duration:550,delay:550+i*90,distance:35});
  });
  const connector=group(range(52,56));
  sequence([{element:connector,frames:[{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0)'}],options:{duration:550,easing:'ease-out'}}],10566,1050);

  if (!reduced) {
    const terrain=[...part(44).children];
    const layers=[[0],[1],[2],[3,4,5,6,7,8],[9,10,11,12,13]].map(ids=>groupElements(ids.map(i=>terrain[i])));
    sequence(layers.map((element,i)=>({element,frames:[{opacity:0,transform:'translateY(130px)'},{opacity:1,transform:'translateY(0)'}],options:{duration:1050,delay:i*150}})),11918,700);
    const meteors=[group(range(40,43)),group(range(6,9))];
    sequence(meteors.map((element,i)=>({element,frames:[{opacity:0,transform:'translate(-280px,-290px)'},{opacity:1,transform:'translate(0,0)'}],options:{duration:850,delay:i*850}})),12358,1100);
    [...range(33,36),...range(345,349),140,142,312,313].forEach((id,i)=>twinkle(part(id),i));
  }
  [[323,329],[330,334],[335,339],[340,344]].forEach(([a,b],i)=>{
    const card=group(range(a,b),{class:'naming-card interactive',tabindex:0});
    const layer=groupElements([...card.children],{class:'naming-hover'});
    groupElements([layer],{class:'naming-drift',style:'--period:'+(4.7+i*.45)+'s;--delay:'+(-i*.9)+'s'});
  });
  const mountainClip=clip('mountains',{y:14488,width:1920,height:1275});
  const mountains=[[314,315,313],[143,142],[141,140,312]].map(ids=>{
    // Preserve each mountain's original paint order while applying a common motion.
    const slots=ids.map(id=>{
      const element=part(id);
      const window=make('g',{'clip-path':mountainClip});
      element.before(window);
      const layer=make('g');
      window.append(layer);layer.append(element);
      return layer;
    });
    return slots;
  });
  sequence(mountains.flatMap((layers,i)=>layers.map(element=>({element,frames:[{transform:'translateY(1300px)'},{transform:'translateY(0)'}],
    options:{duration:1500,delay:i*230,easing:'cubic-bezier(.25,.1,.25,1)'}}))),14638,1250);

  const rabbit=group([514],{'data-capstone':'rabbit',class:'interactive',role:'button',tabindex:0,'aria-label':'토끼 점프'});
  const shadow=group([490]);
  const speech=group(range(511,513));
  if (!reduced) {
    const stages=[[0,1250,0],[.19,950,-125],[.34,740,0],[.52,480,-105],[.67,300,0],[.83,125,-65],[1,0,0]];
    sequence([rabbit,shadow].map(element=>({element,frames:stages.map(([offset,x,y])=>({offset,transform:'translate('+x+'px,'+(element===shadow?0:y)+'px)'})),
      options:{duration:2050,easing:'linear'}})).concat({element:speech,frames:[{opacity:0,transform:'translateY(15px)'},{opacity:1,transform:'translateY(0)'}],options:{duration:350,delay:2050}}),15403,602);
    const jump=()=>{
      if (rabbit.getAnimations().some(animation=>animation.playState==='running')) return;
      const origin=getComputedStyle(rabbit).transform;
      if (origin!=='none' && !/^matrix\(1, 0, 0, 1, 0, 0\)$/.test(origin)) return;
      const options={duration:700,easing:'cubic-bezier(.33,0,.67,1)'};
      move(rabbit,[{transform:'translateY(0)'},{transform:'translateY(-115px)',offset:.45},{transform:'translateY(0)'}],{...options,composite:'add'});
      move(shadow,[{opacity:1},{opacity:.35,offset:.45},{opacity:1}],options);
    };
    rabbit.addEventListener('click',jump);
    rabbit.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();jump()}});
  }

  rise(range(552,681),'turnaround');
  rise([527],'expressions-heading');
  for (let id=528;id<=550;id+=2) {
    rise([id,id+1],'expression',{delay:((id-528)/2%6)*45});
    const character=groupElements([part(id)],{class:'capstone-expression'});
    character.setAttribute('tabindex','0');
  }
  rise([138,139],'design-guide');
  const keywords=await replaceArtwork('design-guide',range(811,821),121,19201);
  const keywordMotion=groupElements([keywords],{'data-capstone':'design-keywords'});
  reveal(keywordMotion,19205.3,179.7);
  rise([682,696],'logo-heading');
  rise(range(683,695),'wordmark');
  const staticMark=group(range(684,694));
  const movie=make('foreignObject',{x:120,y:20112,width:1680,height:355,'clip-path':clip('wordmark-panel',{x:120,y:20035,width:1680,height:480,rx:32})});
  const video=document.createElement('video');
  video.className='capstone-wordmark-video';
  video.src='capstone/wordmark.mp4';
  video.muted=true;video.playsInline=true;video.preload='metadata';
  video.setAttribute('aria-hidden','true');
  movie.append(video);
  staticMark.after(movie);
  video.addEventListener('playing',()=>{movie.style.opacity='1';staticMark.style.opacity='0'});
  video.addEventListener('error',()=>{movie.style.opacity='0';staticMark.style.opacity='1'});
  movie.style.opacity='0';
  visibility(20035,480,()=>{if(!reduced && !video.ended) video.play().catch(()=>{})},()=>{video.pause();video.currentTime=0;movie.style.opacity='0';staticMark.style.opacity='1'});

  rise([697],'logo-apply');
  rise([698,699,700],'app-icon');
  [699,700].forEach(id=>part(id).remove());
  const before=make('image',{href:'capstone/app-icon-guide.svg',x:120,y:20535,width:830,height:500});
  const after=make('image',{href:'capstone/app-icon-final.svg',x:120,y:20535,width:830,height:500});
  part(698).after(before,after);
  after.style.opacity='0';
  let swap;
  visibility(20535,500,()=>{
    swap?.cancel();
    swap=move(after,[{opacity:0},{opacity:1}],{delay:450,duration:1250,easing:'ease-in-out',fill:'both'});
  },()=>swap?.cancel());
  if (reduced) after.style.opacity='1';

  const iconographyY=21375;
  const iconography=await replaceArtwork('iconography',range(158,311),0,iconographyY);
  iconography.style.overflow='visible';
  const iconParts=[...iconography.children];
  const iconGroup=(indices,attributes)=>groupElements(indices.map(i=>iconParts[i]),attributes);
  for (const [indices,name] of [
    [[152,153],'iconography-heading'],
    [range(4,151),'iconography-grid'],
    [range(0,3),'iconography-preview']
  ]) {
    const layer=iconGroup(indices,{'data-capstone':name});
    const box=layer.getBBox();
    reveal(layer,iconographyY+box.y,box.height);
  }
  setupIconPreview({part:i=>iconParts[i],make,group:iconGroup,visibility,reduced,move,action,hit});
  rise(range(144,157),'typography');
  rise(range(822,847),'colors');

  const trees=[[121],[119],[120],[122]].map(ids=>group(ids));
  const treeWindow=clip('trees',{width:1920,y:24931,height:1911});
  for (const tree of trees) {
    const wrapper=make('g',{'clip-path':treeWindow});
    tree.before(wrapper);wrapper.append(tree);
  }
  sequence(trees.map((element,i)=>({element,frames:[{transform:'translateY(2000px)'},{transform:'translateY(0)'}],
    options:{duration:380,delay:i*80,easing:'cubic-bezier(.16,1,.3,1)'}})),24931,1911);
  rise(range(520,523),'features-heading');
  rise(range(524,526),'features-mockups',{delay:120});
  reveal(part(376),26363,1432,{delay:120});
  const onboarding=await replaceArtwork('onboarding',[123,124,125,...range(385,411)],0,28202);
  const onboardingMotion=groupElements([onboarding],{'data-capstone':'onboarding'});
  reveal(onboardingMotion,28202,1137,{distance:36});
  await mountFeatures({part,group,make,visibility,action,hit,importSvg,reduced});
}

function setupIconPreview({part,make,group,visibility,reduced,move,action,hit}) {
  // Each entry lists the source paths for one complete icon in reading order.
  const rows=[
    [[1],[2],[3],[4],[5],[6],[7,8],[9,11],[12,13],[14],[15]],
    [[16],[17],[18],[19],[20],[21],[22],[23,26],[27],[28,29],[30,34]],
    [[35],[36],[37,39],[40,43],[44],[45,49],[50],[51],[52],[53],[54]],
    [[55],[56,58],[59],[60],[61,62],[63],[64,65],[66],[67],[68,69],[70,72]],
    [[73,75],[76,77],[78,84],[85,92],[93,99],[100,106],[107],[108],[109,111],[112,114]],
    [[115,120],[121,126],[127,128],[129,133],[134,137],[138,142],[143,144],[145],[146,147]]
  ];
  const firstIcon=part(5);
  const marker=make('circle',{r:33.5,fill:'#CAFFC9','fill-opacity':.24,'pointer-events':'none','data-capstone':'icon-highlight'});
  firstIcon.before(marker);
  const icons=rows.flatMap(row=>row.map(([start,end=start])=>{
    const index=4+start;
    const icon=group(range(index,4+end),{id:'capstone-system-icon-'+start});
    const box=icon.getBBox();
    return {icon,x:box.x+box.width/2,y:box.y+box.height/2,width:box.width,height:box.height};
  }));
  const previewBox=part(3).getBBox();
  const centerX=previewBox.x+previewBox.width/2,centerY=previewBox.y+previewBox.height/2;
  const stage=make('g',{'data-capstone':'icon-stage','aria-hidden':'true'});
  part(3).replaceWith(stage);
  let current=0,shown,timer,outgoing,visible=false;
  function show(index,transition) {
    stage.dataset.icon=String(index+1);
    const {icon,x,y,width,height}=icons[index];
    marker.setAttribute('cx',x);
    marker.setAttribute('cy',y);
    const size=Math.min(previewBox.width/width,previewBox.height/height);
    const layer=make('g');
    layer.append(make('use',{href:'#'+icon.id,transform:'translate('+centerX+' '+centerY+') scale('+size+') translate('+(-x)+' '+(-y)+')'}));
    stage.append(layer);
    outgoing?.remove();
    outgoing=shown;
    if (shown && transition && !reduced) {
      const leaving=shown;
      move(leaving,[{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(-70px)'}],
        {duration:620,easing,fill:'both'}).finished.then(()=>leaving.remove()).catch(()=>{});
      move(layer,[{opacity:0,transform:'translateX(70px)'},{opacity:1,transform:'translateX(0)'}],
        {duration:620,easing});
    } else shown?.remove();
    shown=layer;
  }
  const schedule = delay => {
    clearTimeout(timer);
    if (!visible || reduced) return;
    timer=setTimeout(()=>{
      current=(current+1)%icons.length;
      show(current,true);
      schedule(2150);
    },delay);
  };
  icons.forEach(({icon,x,y,width,height},i)=>{
    const selection=make('g');
    icon.before(selection);
    selection.append(icon);
    hit(selection,x-Math.max(30,width/2),y-Math.max(30,height/2),Math.max(60,width),Math.max(60,height));
    action(selection,'시스템 아이콘 '+(i+1),()=>{
      current=i;
      show(current,false);
      schedule(2000);
    });
  });
  show(0,false);
  visibility(21616,620,()=>{
    visible=true;
    schedule(2150);
  },()=>{
    visible=false;
    clearTimeout(timer);
    current=0;
    show(0,false);
  });
}
