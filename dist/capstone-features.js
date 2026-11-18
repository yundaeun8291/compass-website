const range=(start,end)=>Array.from({length:end-start+1},(_,i)=>start+i);
const ease='cubic-bezier(.22,1,.36,1)';
// Source-pixel boundaries of the recorded phone bodies, excluding the outer matte.
const recordedPhones={
  explore:[660,1302,11,5,639,1289,"M78,11L64,18L52,27L40,39L29,55L24,66L20,82L19,97L18,98L18,115L17,116L17,259L11,260L11,307L17,308L17,353L16,354L13,353L13,450L17,451L17,478L13,479L13,575L17,576L17,1180L18,1181L19,1208L24,1230L29,1241L37,1253L58,1274L78,1285L96,1290L111,1291L112,1292L128,1292L129,1293L533,1293L534,1292L550,1292L551,1291L566,1290L584,1285L598,1278L610,1269L624,1255L633,1241L638,1230L641,1219L644,1198L644,1182L645,1181L645,543L649,541L649,388L648,386L647,387L645,386L645,116L644,115L643,89L638,66L633,55L624,41L604,22L584,11L571,7L559,5L103,5Z"],
  emotion:[656,1304,3,5,639,1290,"M74,11L60,17L48,25L47,27L44,28L30,43L23,53L14,74L11,90L10,116L9,117L9,260L3,262L3,309L9,310L9,354L5,355L5,451L9,452L9,479L5,480L5,577L9,578L9,1182L10,1183L11,1209L15,1229L23,1246L28,1252L28,1254L48,1274L60,1282L74,1288L99,1293L110,1293L111,1294L535,1294L536,1293L555,1292L572,1288L584,1283L598,1274L613,1260L623,1246L632,1225L635,1209L636,1183L637,1182L637,544L641,543L641,389L637,388L637,117L636,116L635,90L631,70L618,45L598,25L586,17L572,11L547,6L536,6L535,5L111,5L110,6L91,7Z"],
  pocket:[664,1304,9,5,639,1289,"M76,11L62,18L50,27L39,38L27,55L22,66L18,82L17,97L16,98L16,115L15,116L15,259L9,260L9,307L15,308L15,353L14,354L11,353L11,450L15,451L15,478L11,479L11,575L15,576L15,1181L16,1182L16,1198L17,1199L18,1215L20,1219L20,1224L27,1241L38,1257L56,1274L76,1285L94,1290L109,1291L110,1292L126,1292L127,1293L531,1293L532,1292L548,1292L549,1291L564,1290L582,1285L596,1278L608,1269L622,1255L631,1241L636,1230L640,1215L641,1199L642,1198L642,1182L643,1181L643,543L647,541L647,387L643,386L643,116L642,115L641,89L636,66L631,55L622,41L602,22L582,11L557,5L101,5Z"],
  map:[668,1306,9,5,639,1290,"M80,11L66,17L54,25L53,27L50,28L40,38L29,53L20,74L17,90L16,116L15,117L15,260L9,262L9,309L15,310L15,354L11,355L11,451L15,452L15,479L11,480L11,577L15,578L15,1182L16,1183L17,1209L21,1229L29,1246L34,1252L34,1254L54,1274L66,1282L80,1288L105,1293L116,1293L117,1294L541,1294L542,1293L561,1292L578,1288L592,1282L604,1274L619,1260L629,1246L638,1225L641,1209L642,1183L643,1182L643,544L647,543L647,389L643,388L643,117L642,116L641,90L637,70L629,53L624,47L624,45L604,25L592,17L578,11L553,6L542,6L541,5L117,5L116,6L97,7Z"],
  home:[666,1308,13,8,639,1290,"M84,14L70,20L54,31L44,41L33,56L24,77L21,93L20,119L19,120L19,263L13,265L13,312L19,313L19,357L15,358L15,454L19,455L19,482L15,483L15,580L19,581L19,1185L20,1186L20,1203L21,1204L22,1219L27,1237L38,1257L50,1270L65,1282L84,1291L109,1296L120,1296L121,1297L545,1297L546,1296L565,1295L582,1291L594,1286L608,1277L622,1264L633,1249L639,1237L643,1224L646,1203L646,1186L647,1185L647,547L651,546L651,392L647,391L647,120L646,119L645,93L641,73L633,56L628,50L628,48L608,28L596,20L582,14L558,9L546,9L545,8L121,8L120,9L101,10Z"],
  mission:[658,1306,9,4,639,1290,"M80,10L66,16L54,24L53,26L50,27L40,37L29,52L23,64L19,76L20,77L17,89L16,115L15,116L15,259L9,261L9,308L15,309L15,353L11,354L11,450L15,451L15,478L11,479L11,576L15,577L15,1181L16,1182L17,1208L21,1228L34,1253L46,1266L58,1276L66,1281L80,1287L105,1292L116,1292L117,1293L541,1293L542,1292L561,1291L578,1287L592,1281L604,1273L619,1259L629,1245L638,1224L641,1208L642,1182L643,1181L643,543L647,542L647,388L643,387L643,116L642,115L641,89L637,69L624,44L604,24L592,16L578,10L553,5L542,5L541,4L117,4L116,5L97,6Z"],
  profile:[664,1306,3,7,639,1290,"M74,13L60,19L48,27L47,29L44,30L34,40L23,55L17,67L13,79L14,80L11,92L10,118L9,119L9,262L3,264L3,311L9,312L9,356L5,357L5,453L9,454L9,482L8,483L5,482L5,579L9,580L9,1184L10,1185L11,1211L15,1231L23,1248L28,1254L28,1256L39,1268L52,1279L62,1285L74,1290L99,1295L110,1295L111,1296L535,1296L536,1295L555,1294L572,1290L586,1284L598,1276L613,1262L623,1248L632,1227L635,1211L636,1185L637,1184L637,546L641,545L641,391L637,390L637,119L636,118L635,92L631,72L623,55L618,49L618,47L598,27L586,19L572,13L547,8L536,8L535,7L111,7L110,8L91,9Z"],
  camp:[680,1302,16,7,639,1289,"M83,13L69,20L57,29L44,42L34,57L29,68L25,84L24,99L23,100L23,117L22,118L22,261L16,262L16,309L22,310L22,355L18,356L18,452L22,453L22,480L18,481L18,577L22,578L22,1183L23,1184L24,1209L26,1217L25,1218L27,1221L27,1226L34,1243L41,1254L63,1276L83,1287L101,1292L116,1293L117,1294L133,1294L134,1295L538,1295L539,1294L555,1294L556,1293L571,1292L589,1287L598,1283L613,1273L629,1257L638,1243L643,1232L646,1221L649,1200L649,1184L650,1183L650,545L654,543L654,389L650,388L650,118L649,117L648,91L643,68L638,57L629,43L609,24L589,13L576,9L564,7L108,7L96,9Z"]
};

export async function mountFeatures({part,group,make,visibility,action,hit,importSvg,reduced}) {
  function animate(element,frames,duration,options={}) {
    return element.animate(frames,{duration:reduced?1:duration,easing:ease,fill:'both',...options});
  }

  function phone(name,anchor,{x,y,width,height}) {
    const [videoWidth,videoHeight,left,top,bodyWidth,bodyHeight,outline]=recordedPhones[name];
    const scale=Math.min(width/bodyWidth,height/bodyHeight);
    const offsetX=x+(width-bodyWidth*scale)/2;
    const offsetY=y+(height-bodyHeight*scale)/2;
    const holder=make('g',{transform:'translate('+offsetX+' '+offsetY+') scale('+scale+') translate('+(-left)+' '+(-top)+')'});
    const mask=make('clipPath',{id:'recorded-phone-'+name,clipPathUnits:'userSpaceOnUse'});
    mask.append(make('path',{d:outline}));
    const frame=make('foreignObject',{width:videoWidth,height:videoHeight,'data-feature-video':name,
      'clip-path':'url(#'+mask.id+')',class:'phone-video'});
    holder.append(mask,frame);
    const container=document.createElement('div');
    container.className='phone-video-clip';
    const video=document.createElement('video');
    const poster=document.createElement('img');
    poster.className='phone-poster';
    poster.alt='';
    video.style.transform='none';
    video.style.objectFit='contain';
    poster.style.objectFit='contain';
    video.muted=true;
    video.playsInline=true;
    video.preload='auto';
    video.src=media(name,'mp4');
    poster.src=media(name,'jpg');
    video.addEventListener('playing',()=>{poster.hidden=true});
    container.append(video,poster);
    frame.append(container);
    part(anchor).replaceWith(holder);
    return {video,reset(){
      video.pause();
      video.currentTime=0;
      poster.hidden=false;
    }};
  }

  function rasterPhone(name,id) {
    return phone(name,id,part(id).getBBox());
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

  const explore=rasterPhone('explore',849);
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
  const emotion=phone('emotion',954,{x:749,y:32489,width:422,height:852});
  range(955,975).forEach(id=>part(id).remove());
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
    if(back) {
      hover.append(
        make('image',{class:'record-front',href:record(back+'-front'),x,y,width,height}),
        make('image',{class:'record-back',href:record(back),x,y,width,height})
      );
      front.remove();
    } else hover.append(front);
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

function media(name,extension) {
  const source='capstone/media/'+name+'.'+extension;
  return source.startsWith('data:')?source:source+'?v=14';
}
function record(side) {
  const source='capstone/record-'+side+'.svg';
  return source.startsWith('data:')?source:source+'?v=12';
}
