const range=(start,end)=>Array.from({length:end-start+1},(_,i)=>start+i);
const ease='cubic-bezier(.22,1,.36,1)';

export async function mountFeatures({part,group,make,visibility,clip,action,hit,importSvg,reduced}) {
  function animate(element,frames,duration,options={}) {
    return element.animate(frames,{duration:reduced?1:duration,easing:ease,fill:'both',...options});
  }

  function phone(name,anchor,box) {
    const {x,y,width,height,rx=42}=box;
    const frame=make('foreignObject',{x,y,width,height,'data-feature-video':name,
      'clip-path':clip('video-'+name,{x,y,width,height,rx}),class:'phone-video'});
    const container=document.createElement('div');
    container.className='phone-video-clip';
    const video=document.createElement('video');
    const poster=document.createElement('img');
    poster.className='phone-poster';
    poster.alt='';
    video.muted=true;
    video.playsInline=true;
    video.preload='auto';
    video.src=media(name,'mp4');
    poster.src=media(name,'jpg');
    video.addEventListener('playing',()=>{poster.hidden=true});
    container.append(video,poster);
    frame.append(container);
    part(anchor).after(frame);
    return {video,reset(){
      video.pause();
      video.currentTime=0;
      poster.hidden=false;
    }};
  }

  function rasterPhone(name,id) {
    const {x,y,width,height}=part(id).getBBox();
    return phone(name,id,{x:x+width*42/844,y:y+height*40/1704,width:width*758/844,height:height*1624/1704});
  }

  function playInOrder(phones,y,height,{reset=()=>{},done=()=>{}}={}) {
    let active=false,index=0;
    function play(){
      phones[index].video.play().catch(()=>{});
    }
    phones.forEach(({video},position)=>video.addEventListener('ended',()=>{
      if (!active || index!==position) return;
      if (index+1===phones.length) {done();return}
      index+=1;
      play();
    }));
    const stop=()=>{
      active=false;
      phones.forEach(phone=>phone.reset());
      index=0;
      reset();
    };
    visibility(y,height,()=>{
      stop();
      active=true;
      if (!reduced) play();
    },stop);
  }

  const explore=phone('explore',849,{x:230,y:30820,width:379,height:812});
  const shade=part(852),envy=group(range(853,860)),icons=group(range(861,865)),description=group([850,851]);
  const buttonPosition={x:359.3,y:31325.5};
  envy.setAttribute('transform','translate(-8.2 -74.9)');
  const arrow=make('path',{d:'M401 31325.5 H633 Q666 31325.5 687 31348 L712 31379 Q730 31401 757 31401 H790 M779 31390 L790 31401 L779 31412',
    fill:'none',stroke:'#43D19D','stroke-width':3,'stroke-dasharray':'6 5'});
  part(866).replaceWith(arrow);
  const click=make('text',{x:buttonPosition.x+48,y:buttonPosition.y+8,class:'click-label','font-size':24});
  click.textContent='Click!';
  envy.after(click);
  let envyAnimations=[];
  const show=(element,visible)=>{element.style.opacity=visible?'1':'0'};
  const resetExplore=()=>{
    envyAnimations.forEach(animation=>animation.cancel());
    envyAnimations=[];
    [shade,envy,icons,description,arrow,click].forEach(element=>show(element,false));
    envy.style.pointerEvents='none';
    envy.setAttribute('tabindex','-1');
    envy.setAttribute('aria-expanded','false');
  };
  action(envy,'부러워 버튼 펼치기',()=>{
    if (envy.getAttribute('aria-expanded')==='true' || envy.getAttribute('tabindex')==='-1') return;
    envy.setAttribute('aria-expanded','true');
    envyAnimations.forEach(animation=>animation.cancel());
    show(click,false);
    envyAnimations=[
      animate(arrow,[{clipPath:'inset(0 100% 0 0)',opacity:1},{clipPath:'inset(0)',opacity:1}],650),
      animate(icons,[{clipPath:'inset(0 100% 0 0)',opacity:1},{clipPath:'inset(0)',opacity:1}],850,{delay:reduced?0:650}),
      animate(description,[{transform:'translateY(28px)',opacity:0},{transform:'translateY(0)',opacity:1}],1200,{delay:reduced?0:1500})
    ];
    show(arrow,true);
    show(icons,true);
  });
  hit(envy,326,31360,83,81);
  resetExplore();
  playInOrder([explore],30800,852,{reset:resetExplore,done(){
    [shade,envy,click].forEach(element=>show(element,true));
    envy.style.pointerEvents='';
    envy.setAttribute('tabindex','0');
    const entry=animate(envy,[{opacity:0,scale:'.55'},{opacity:1,scale:'1'}],650);
    envy.style.transformBox='fill-box';
    envy.style.transformOrigin='center';
    envyAnimations=[entry];
    if (!reduced) envyAnimations.push(animate(envy,[{translate:'0 0'},{translate:'0 -8px'},{translate:'0 0'}],2100,{delay:650,iterations:Infinity,easing:'ease-in-out'}));
  }});

  const strip=part(848);
  const track=make('g');
  const cards=[...strip.children];
  track.append(...cards);
  strip.append(track);
  const length=track.getBBox().width+12;
  const template=track.cloneNode(true);
  for(const offset of [-length,length]) {
    const repeat=template.cloneNode(true);
    repeat.setAttribute('transform','translate('+offset+' 0)');
    track.append(repeat);
  }
  if (!reduced) {
    const slide=animate(track,[{transform:'translateX(0)'},{transform:'translateX('+(-length)+'px)'}],33000,{iterations:Infinity,easing:'linear'});
    slide.pause();
    visibility(32509,812,()=>slide.play(),()=>slide.pause());
  }
  const emotion=phone('emotion',969,{x:772.8,y:32509.1,width:374.4,height:811.8,rx:46});
  playInOrder([emotion],32509,812);
  playInOrder([rasterPhone('pocket',876),rasterPhone('map',877)],35395,832);
  playInOrder([rasterPhone('home',353),rasterPhone('mission',359)],38913,832);
  playInOrder([rasterPhone('profile',983),rasterPhone('camp',981)],43925,830);

  const trigger=group([980],{class:'week-trigger','data-part':'week3'});
  trigger.firstElementChild.classList.add('week-preview');
  hit(trigger,120,40572,355,355);
  const hint=make('g',{'data-part':'week3-hint','pointer-events':'none'});
  const hintArt=await importSvg('week3 어포던스');
  hintArt.setAttribute('x',138);
  hintArt.setAttribute('y',40972);
  hint.append(hintArt);
  trigger.after(hint);
  if (!reduced) animate(hint,[{translate:'0 0'},{translate:'0 -6px'},{translate:'0 0'}],2100,{iterations:Infinity,easing:'ease-in-out'});
  const reports=[[415,436,357],[437,458,358],[459,480,356]].map(([a,b,label],i)=>{
    const hover=group([...range(a,b),label],{class:'week-mockup-hover',tabindex:-1});
    const slot=make('g',{class:'mockup-reveal week-hidden','data-mockup':i+1,'aria-hidden':'true'});
    hover.before(slot);
    slot.append(hover);
    return {slot,hover};
  });
  let open=false;
  action(trigger,'Week 3 마음 탐험 일지 열기',()=>{
    open=!open;
    trigger.setAttribute('aria-expanded',String(open));
    hint.style.opacity=open?'0':'1';
    reports.forEach(({slot,hover},i)=>{
      const style=getComputedStyle(slot);
      const from={opacity:style.opacity,transform:slot.classList.contains('week-hidden')?'translateX(-42px)':style.transform};
      slot.getAnimations().forEach(animation=>animation.cancel());
      slot.classList.remove('week-hidden');
      slot.style.pointerEvents=open?'':'none';
      slot.setAttribute('aria-hidden',String(!open));
      hover.setAttribute('tabindex',open?'0':'-1');
      animate(slot,[from,{opacity:open?1:0,transform:open?'translateX(0)':'translateX(-42px)'}],
        open?430:330,{delay:reduced?0:open?i*105:(2-i)*65});
    });
  });
  trigger.setAttribute('aria-expanded','false');

  for(const [first,last,back] of [[369,372,null],[481,483,'left'],[484,486,'right']]) {
    const front=group(range(first,last),{class:'record-front'});
    const card=make('g',{class:'interactive record-card'+(back?'':' no-back'),tabindex:0,role:'img',
      'aria-label':({left:'나의 성장 기록',right:'하루의 실천 기록'})[back]??'모닥불로 성장 확인하기'});
    const hover=make('g',{class:'hover-scale'});
    const {x,y,width,height}=part(first).getBBox();
    front.before(card);
    card.append(hover);
    hover.append(front);
    if(back) hover.append(make('image',{class:'record-back',href:record(back),x,y,width,height}));
    hit(card,x,y,width,height);
  }

  if (!reduced) {
    let bounce=[];
    const decor=[part(516),part(515)];
    decor.forEach((element,i)=>{element.style.transform='translateX('+(i?36:-36)+'px)'});
    visibility(43925,830,()=>{
      bounce=decor.map((element,i)=>{
        const direction=i?1:-1;
        return animate(element,[{transform:'translateX('+36*direction+'px)'},{transform:'translateX('+(-6*direction)+'px)',offset:.7},{transform:'translateX(0)'}],900);
      });
    },()=>{
      bounce.forEach(animation=>animation.cancel());
      bounce=[];
    });
  }
}

const media=(name,extension)=>'capstone/media/'+name+'.'+extension;
const record=side=>'capstone/record-'+side+'.svg';
