export async function setupFeatureVideos({svg,node,make,watch,watchers,myPage,onExploreStart,onExploreEnd,onExploreLeave}){
 const sources=await fetch('videos/manifest.json?v=7').then(r=>{if(!r.ok)throw Error('Video manifest unavailable');return r.json()});
 function rasterScreen(rect){const b=rect.getBBox();return {x:b.x+b.width*42/844,y:b.y+b.height*40/1704,w:b.width*758/844,h:b.height*1624/1704,r:b.width*82/844,outer:b}}
 function slot(key,box,anchor,globalYOffset=0){
  const frame=sources[key].frame;if(frame){const b=box.outer;box={...box,y:b.y+b.height*36/1704,h:b.height*1636/1704,r:b.width*88/844}}

  const object=make('foreignObject',{x:box.x,y:box.y,width:box.w,height:box.h,'data-video':key,'data-state':'waiting','aria-hidden':'true',class:'phone-video'});
  const wrap=document.createElement('div');wrap.className='phone-video-clip';wrap.style.borderRadius=box.r+'px';
  const video=document.createElement('video');video.src=sources[key].src;video.playbackRate=sources[key].playbackRate||1;video.defaultPlaybackRate=video.playbackRate;video.muted=true;video.defaultMuted=true;video.setAttribute('muted','');video.playsInline=true;video.setAttribute('playsinline','');video.preload='auto';video.controls=false;video.loop=false;video.disablePictureInPicture=true;video.style.visibility='hidden';
  const layer=make('g',{'pointer-events':'none'});wrap.append(video);object.append(wrap);layer.append(object);anchor.after(layer);
  if(sources[key].poster){const poster=document.createElement('img');poster.className='phone-poster';poster.src=sources[key].poster;poster.alt='';wrap.prepend(poster)}
  if(frame){const b=box.outer;layer.append(make('image',{href:frame,x:b.x,y:b.y,width:b.width,height:b.height}))}
  const hardware=sources[key].hardware;
  if(hardware){const [x,y,w,h]=hardware.box,b=box.outer;layer.append(make('image',{href:hardware.src,x:b.x+x/844*b.width,y:b.y+y/1704*b.height,width:w/844*b.width,height:h/1704*b.height}))}
  video.addEventListener('timeupdate',()=>object.setAttribute('data-time',video.currentTime.toFixed(2)));
  video.addEventListener('error',()=>{object.setAttribute('data-state','error');console.error('Feature video could not load:',key)});
  const transform=anchor.getAttribute('data-video-offset');if(transform)layer.setAttribute('transform',transform);
  return {key,layer,object,video,anchor,frame,y:box.y+globalYOffset+(key==='explore'?+anchor.getAttribute('data-offset-y')||0:0),h:box.h};
 }
 function sequence(name,slots,hooks={}){
  let active=false,generation=0,index=-1,cycle=0;
  slots.forEach((s,i)=>{s.object.setAttribute('data-sequence',name);s.object.setAttribute('data-order',i+1)});
  function reset(){slots.forEach(s=>{s.video.pause();if(s.frame)s.anchor.style.visibility='';s.video.currentTime=0;s.video.style.visibility='hidden';s.object.setAttribute('data-state','waiting');s.object.setAttribute('data-time','0')})}
  function play(i,token){
   if(!active||token!==generation)return;
   index=i;
   if(i>=slots.length){hooks.complete?.();if(slots.length>1){++cycle;slots.forEach(s=>s.object.setAttribute('data-cycle',cycle));reset();play(0,token)}return}
   const s=slots[i];s.object.setAttribute('data-state','loading');
   s.video.onplaying=()=>{if(active&&token===generation&&index===i){s.video.style.visibility='visible';if(s.frame)s.anchor.style.visibility='hidden';s.object.setAttribute('data-state','playing')}};
   s.video.onended=()=>{if(!active||token!==generation||index!==i)return;s.video.pause();s.object.setAttribute('data-state','ended');s.object.setAttribute('data-time',s.video.currentTime.toFixed(2));play(i+1,token)};
   s.video.play().catch(error=>{if(active&&token===generation){s.object.setAttribute('data-state','error');console.error('Feature autoplay failed:',s.key,error)}});
  }
  const y=Math.min(...slots.map(s=>s.y)),height=Math.max(...slots.map(s=>s.y+s.h))-y;
  watchers.push(watch(y,height,()=>{active=true;const token=++generation;reset();hooks.start?.();play(0,token)},()=>{active=false;++generation;index=-1;reset();hooks.leave?.()}));
 }
 const explore=slot('explore',rasterScreen(node(278)),node(278));
 // The existing shade remains above the moving screen and below the button.
 node(281).before(explore.layer);
 sequence('explore',[explore],{start:onExploreStart,complete:onExploreEnd,leave:onExploreLeave});
 const compass=slot('compass',{x:772.79,y:28018.1,w:374.36,h:811.8,r:47.65},node(678));
 sequence('compass',[compass]);
 sequence('map',[
  slot('firefly',rasterScreen(node(562)),node(562)),
  slot('map',rasterScreen(node(563)),node(563))
 ]);
 sequence('home',[
  slot('home',rasterScreen(node(647)),node(647)),
  slot('mission',rasterScreen(node(653)),node(653))
 ]);
 const myPagePosters=Array.from(myPage.children).filter(e=>e.tagName==='rect'&&e.getAttribute('fill')?.startsWith('url(')).sort((a,b)=>+a.getAttribute('x')-+b.getAttribute('x'));
 const offset=+myPage.getAttribute('y');
 sequence('mypage',[
  slot('mypage',rasterScreen(myPagePosters[0]),myPagePosters[0],offset),
  slot('basecamp',rasterScreen(myPagePosters[1]),myPagePosters[1],offset)
 ]);
}
