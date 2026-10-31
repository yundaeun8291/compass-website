export async function setupFeatureVideos({svg,node,make,watch,watchers,myPage,onExploreStart,onExploreEnd,onExploreLeave}){
 const sources=await fetch('videos/manifest.json?v=4').then(r=>{if(!r.ok)throw Error('Video manifest unavailable');return r.json()});
 function rasterScreen(rect){const b=rect.getBBox();return {x:b.x+b.width*48/844,y:b.y+b.height*40/1704,w:b.width*748/844,h:b.height*1616/1704,r:b.width*100/844,outer:b}}
 function slot(key,box,anchor,globalYOffset=0){
  const object=make('foreignObject',{x:box.x,y:box.y,width:box.w,height:box.h,'data-video':key,'data-state':'waiting','aria-hidden':'true',class:'phone-video'});
  const wrap=document.createElement('div');wrap.className='phone-video-clip';wrap.style.borderRadius=box.r+'px';
  const video=document.createElement('video');video.src=sources[key].src;video.muted=true;video.defaultMuted=true;video.setAttribute('muted','');video.playsInline=true;video.setAttribute('playsinline','');video.preload='auto';video.controls=false;video.loop=false;video.disablePictureInPicture=true;video.style.visibility='hidden';
  const layer=make('g',{'pointer-events':'none'});wrap.append(video);object.append(wrap);layer.append(object);anchor.after(layer);
  const hardware=sources[key].hardware;
  if(hardware){const [x,y,w,h]=hardware.box,b=box.outer;layer.append(make('image',{href:hardware.src,x:b.x+x/844*b.width,y:b.y+y/1704*b.height,width:w/844*b.width,height:h/1704*b.height}))}
  video.addEventListener('timeupdate',()=>object.setAttribute('data-time',video.currentTime.toFixed(2)));
  video.addEventListener('error',()=>{object.setAttribute('data-state','error');console.error('Feature video could not load:',key)});
  return {key,layer,object,video,y:box.y+globalYOffset,h:box.h};
 }
 function sequence(name,slots,hooks={}){
  let active=false,generation=0,index=-1;
  slots.forEach((s,i)=>{s.object.setAttribute('data-sequence',name);s.object.setAttribute('data-order',i+1)});
  function reset(){slots.forEach(s=>{s.video.pause();s.video.currentTime=0;s.video.style.visibility='hidden';s.object.setAttribute('data-state','waiting');s.object.setAttribute('data-time','0')})}
  function play(i,token){
   if(!active||token!==generation)return;
   index=i;
   if(i>=slots.length){hooks.complete?.();return}
   const s=slots[i];s.object.setAttribute('data-state','loading');
   s.video.onplaying=()=>{if(active&&token===generation&&index===i){s.video.style.visibility='visible';s.object.setAttribute('data-state','playing')}};
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
