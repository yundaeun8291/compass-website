export function setupPlanningPlayer({node,make,watch,watchers}){
 const area=node(45).getBBox(),circle=node(46),triangle=node(47);
 const originalIcon=make('svg',{viewBox:'860 2652 200 200','aria-hidden':'true'});
 originalIcon.append(circle.cloneNode(true),triangle.cloneNode(true));
 const object=make('foreignObject',{x:area.x,y:area.y,width:area.width,height:area.height,'data-part':'planning-player'});
 const player=document.createElement('div');player.className='planning-player';
 player.innerHTML=`<video playsinline preload="metadata" aria-label="COMPASS 소개 영상"></video><button class="film-start" aria-label="COMPASS 소개 영상 재생"></button><div class="film-flash" aria-hidden="true"></div><div class="film-controls"><button class="film-toggle" aria-label="영상 재생">▶</button><input class="film-progress" aria-label="영상 재생 위치" type="range" min="0" max="1000" value="0"><div class="film-volume"><button class="film-sound" aria-label="볼륨 조절" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 9v6h4l5 4V5L7 9H3Zm12-2v2a4 4 0 0 1 0 6v2a6 6 0 0 0 0-10Zm3-3v2a8 8 0 0 1 0 12v2a10 10 0 0 0 0-16Z"/></svg></button><div class="film-volume-panel" hidden><input class="film-volume-slider" aria-label="볼륨" type="range" min="0" max="1" step="0.01" value="1"></div></div></div>`;
 const film=player.querySelector('video'),start=player.querySelector('.film-start'),flash=player.querySelector('.film-flash'),toggle=player.querySelector('.film-toggle'),progress=player.querySelector('.film-progress'),volume=player.querySelector('.film-volume-slider'),sound=player.querySelector('.film-sound'),panel=player.querySelector('.film-volume-panel');
 film.src='videos/planning.mp4';start.append(originalIcon);object.append(player);node(45).after(object);circle.remove();triangle.remove();
 let flashTimer,started=false;
 function showFlash(playing){clearTimeout(flashTimer);flash.innerHTML=playing?'<svg viewBox="0 0 100 100"><path d="M35 23L78 50 35 77Z"/></svg>':'<svg viewBox="0 0 100 100"><path d="M31 24H43V76H31ZM57 24H69V76H57Z"/></svg>';flash.classList.add('shown');flashTimer=setTimeout(()=>flash.classList.remove('shown'),1000)}
 async function change(){if(film.paused){try{await film.play();started=true;player.classList.add('started');showFlash(true)}catch(error){console.error('Planning video playback failed',error)}}else{film.pause();showFlash(false)}}
 start.addEventListener('click',e=>{e.stopPropagation();change()});player.addEventListener('click',e=>{if(!e.target.closest('.film-controls')&&!e.target.closest('.film-start'))change()});
 toggle.addEventListener('click',change);sound.addEventListener('click',()=>{panel.hidden=!panel.hidden;sound.setAttribute('aria-expanded',String(!panel.hidden))});volume.addEventListener('input',()=>{film.volume=+volume.value;film.muted=film.volume===0});
 progress.addEventListener('input',()=>{if(Number.isFinite(film.duration))film.currentTime=+progress.value/1000*film.duration});film.addEventListener('timeupdate',()=>{if(Number.isFinite(film.duration))progress.value=String(film.currentTime/film.duration*1000)});
 function status(){toggle.textContent=film.paused?'▶':'Ⅱ';toggle.setAttribute('aria-label',film.paused?'영상 재생':'영상 일시 정지');player.dataset.state=film.paused?'paused':'playing'}film.addEventListener('play',status);film.addEventListener('pause',status);film.addEventListener('ended',()=>{showFlash(false);status()});
 watchers.push(watch(area.y,area.height,()=>{},()=>{if(started)film.pause();panel.hidden=true;sound.setAttribute('aria-expanded','false')}));
}
