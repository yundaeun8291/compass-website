export function setupPlanningPlayer({node,make,watch,watchers}){
 const area=node(45).getBBox(),circle=node(46),triangle=node(47);
 const object=make('foreignObject',{x:area.x,y:area.y,width:area.width,height:area.height,'data-part':'planning-player'});
 const player=document.createElement('div');player.className='planning-player';
 player.innerHTML=`<video playsinline preload="metadata" aria-label="COMPASS 소개 영상"></video><button class="film-start" aria-label="COMPASS 소개 영상 재생"></button><div class="film-flash" aria-hidden="true"></div><div class="film-controls"><button class="film-toggle" aria-label="영상 재생">▶</button><input class="film-progress" aria-label="영상 재생 위치" type="range" min="0" max="1000" value="0"><div class="film-volume"><button class="film-sound" aria-label="볼륨 조절" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 9v6h4l5 4V5L7 9H3Zm12-2v2a4 4 0 0 1 0 6v2a6 6 0 0 0 0-10Zm3-3v2a8 8 0 0 1 0 12v2a10 10 0 0 0 0-16Z"/></svg></button><div class="film-volume-panel" hidden><input class="film-volume-slider" aria-label="볼륨" type="range" min="0" max="1" step="0.01" value="1"></div></div></div>`;
 const placeholder=player.querySelector('video'),film=document.querySelector('#intro-preload')||placeholder,start=player.querySelector('.film-start'),flash=player.querySelector('.film-flash'),toggle=player.querySelector('.film-toggle'),progress=player.querySelector('.film-progress'),volume=player.querySelector('.film-volume-slider'),sound=player.querySelector('.film-sound'),panel=player.querySelector('.film-volume-panel');
 if(film!==placeholder)placeholder.replaceWith(film);film.removeAttribute('id');film.removeAttribute('hidden');film.removeAttribute('aria-hidden');film.setAttribute('aria-label','COMPASS 소개 영상');start.remove();
 if(!film._sourceReady&&!film.getAttribute('src'))film.src='videos/planning-final.mp4';film.poster='images/planning-final-poster.jpg';film.preload='auto';film.muted=false;film.defaultMuted=false;film.volume=1;player.classList.add('started');object.append(player);node(45).after(object);circle.remove();triangle.remove();
 let flashTimer,idleTimer,active=false,generation=0;
 const mediaReady=film._sourceReady||Promise.resolve();
 function hideControls(){player.classList.remove('controls-visible');panel.hidden=true;sound.setAttribute('aria-expanded','false')}
 function activity(){clearTimeout(idleTimer);player.classList.add('controls-visible');idleTimer=setTimeout(hideControls,2000)}
 player.addEventListener('pointermove',activity);player.addEventListener('pointerdown',activity);player.addEventListener('keydown',activity);
 player.addEventListener('pointerleave',()=>{clearTimeout(idleTimer);hideControls()});
 function showFlash(playing){clearTimeout(flashTimer);flash.innerHTML=playing?'<svg viewBox="0 0 100 100"><path d="M35 23L78 50 35 77Z"/></svg>':'<svg viewBox="0 0 100 100"><path d="M31 24H43V76H31ZM57 24H69V76H57Z"/></svg>';flash.classList.add('shown');flashTimer=setTimeout(()=>flash.classList.remove('shown'),1000)}
 async function play(manual=false){const token=generation;try{await mediaReady;if(token!==generation||!active)return;await film.play();if(token!==generation){if(!active)film.pause();return}player.classList.remove('autoplay-blocked');delete player.dataset.error;if(manual)showFlash(true)}catch(error){if(token!==generation)return;player.dataset.error=error.name;if(error.name==='NotAllowedError'){player.classList.add('autoplay-blocked');player.dataset.state='autoplay-blocked'}else if(error.name!=='AbortError')console.error('Planning video playback failed',error)}}
 async function change(){activity();if(film.paused){await play(true)}else{film.pause();showFlash(false)}}
 player.addEventListener('click',e=>{if(!e.target.closest('.film-controls'))change()});
 toggle.addEventListener('click',change);sound.addEventListener('click',()=>{panel.hidden=!panel.hidden;sound.setAttribute('aria-expanded',String(!panel.hidden))});volume.addEventListener('input',()=>{film.volume=+volume.value;film.muted=film.volume===0});
 progress.addEventListener('input',()=>{if(Number.isFinite(film.duration))film.currentTime=+progress.value/1000*film.duration});film.addEventListener('timeupdate',()=>{if(Number.isFinite(film.duration))progress.value=String(film.currentTime/film.duration*1000)});
 function status(){toggle.textContent=film.paused?'▶':'Ⅱ';toggle.setAttribute('aria-label',film.paused?'영상 재생':'영상 일시 정지');player.dataset.state=film.paused?'paused':'playing'}film.addEventListener('play',status);film.addEventListener('pause',status);film.addEventListener('ended',()=>{showFlash(false);status()});
 // Observe independently of the remaining SVG asset initialization, so the
 // intro can start as soon as it enters view. Never substitute muted playback.
 function visibility(){const b=object.getBoundingClientRect(),visible=Math.max(0,Math.min(b.bottom,innerHeight)-Math.max(b.top,0));
  // Enter relative to the available viewport; leave only when completely offscreen.
  const next=active?visible>0:visible>=Math.min(b.height,innerHeight)*.4;
  if(next===active)return;active=next;player.dataset.inView=String(active);++generation;
  if(active){film.currentTime=0;play()}else{film.pause();film.currentTime=0;player.classList.remove('autoplay-blocked');hideControls();clearTimeout(flashTimer);flash.classList.remove('shown')}
 }
 const observer=new IntersectionObserver(visibility,{threshold:[0,.1,.4,1]});observer.observe(object);watchers.push(visibility);
 film.addEventListener('waiting',()=>player.dataset.state='buffering');
 film.addEventListener('playing',()=>{status();player.classList.remove('autoplay-blocked')});
 film.addEventListener('error',()=>player.dataset.error=String(film.error?.code||'media-error'));
 // If the browser rejected audible autoplay, retry from a real user action
 // while this section is visible; explicit pause and seek controls stay intact.
 function retry(event){if(event.isTrusted&&active&&film.paused&&player.classList.contains('autoplay-blocked')&&!player.contains(event.target))play()}
 document.addEventListener('pointerdown',retry);document.addEventListener('keydown',retry);
}
