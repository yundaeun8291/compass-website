import fs from 'node:fs';import {spawnSync} from 'node:child_process';import assert from 'node:assert/strict';
const html=fs.readFileSync('../../outputs/COMPASS.html','utf8');
const script=html.match(/<script type="module">([\s\S]*)<\/script>/)[1];
const temp='../../work/standalone-check.mjs';fs.writeFileSync(temp,script);
const result=spawnSync(process.execPath,['--check',temp],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);
assert.ok(!script.includes('await fetch('),'Standalone must not request external assets');
for(const file of fs.readdirSync('dist/images'))assert.ok(fs.statSync('dist/images/'+file).size<25000000,'Static file size limit');
const art=fs.readFileSync('dist/art.svg','utf8');assert.ok(art.includes('viewBox="0 0 1920 40976"'));assert.equal((art.match(/data-i=/g)||[]).length,818);
console.log('Passed: standalone syntax, embedded assets, original 1920×40976 canvas and all 818 original elements, static size limits.');
