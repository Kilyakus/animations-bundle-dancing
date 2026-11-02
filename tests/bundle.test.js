import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {DANCE_MANIFESTS} from '../index.js';

test('each dance has an independent manifest and a valid MDA for each rig',async()=>{
 assert.deepEqual(DANCE_MANIFESTS.map(m=>m.id),['give-your-soul','planet-b','planet-b-challenge']);
 const paths=new Set();
 for(const m of DANCE_MANIFESTS){
  assert.equal(m.type,'dance');assert.ok(m.groups.includes('dance'));assert.ok(m.slots.includes('dance'));
  assert.deepEqual(m.characters,['capsule','vrm','animebase']);
  assert.match(m.sourceFbx, new RegExp(`^animations/${m.id}/[^/]+\\.fbx$`));
  const original=await readFile(new URL('../'+m.sourceFbx,import.meta.url));
  assert.equal(original.subarray(0,20).toString(),'Kaydara FBX Binary  ');
  const sourceHash=createHash('sha256').update(original).digest('hex');
  for(const character of m.characters){
   const file=m.files[character];assert.equal(file,`animations/${m.id}/${character}.mda`);assert.ok(!paths.has(file));paths.add(file);
   const bytes=await readFile(new URL('../'+file,import.meta.url));assert.equal(bytes.subarray(0,4).toString(),'MDA1');
   const size=bytes.readUInt32LE(4),meta=JSON.parse(bytes.subarray(8,8+size));
   assert.equal(meta.id,m.id);assert.equal(meta.character,character);assert.equal(meta.version,1);assert.equal(meta.fps,60);assert.ok(meta.frames>1400);assert.ok(meta.duration>24);
   assert.ok(meta.bones.length>20);assert.equal(bytes.length,8+size+(4-size%4)%4+meta.frames*(4+meta.bones.length*4)*4);
   assert.equal(meta.sourceSha256,sourceHash,'the clip was baked from the FBX in the same folder');
  }
 }
 assert.equal(paths.size,9);
});
