// Download the complete intro before playing, including on hosts without byte ranges.
// Start at document parse time so the hero viewing time is used for loading.
const intro=document.querySelector('#intro-preload');
intro._sourceReady=fetch('videos/planning-final.mp4',{priority:'high'}).then(response=>{
 if(!response.ok)throw Error('Intro download failed: '+response.status);
 return response.blob();
}).then(blob=>{
 intro.src=URL.createObjectURL(blob);intro.dataset.download='complete';intro.load();
}).catch(error=>{
 intro.dataset.download='fallback';intro.src='videos/planning-final.mp4';intro.load();console.error(error);
});
