const {test}=require('node:test');
const assert=require('node:assert/strict');
const {stepAmount,createRepeater}=require('../src/amountStepper');

test('gram controls step by one, support decimals, and never go negative',()=>{
 assert.equal(stepAmount('100',1),'101');
 assert.equal(stepAmount('100',-1),'99');
 assert.equal(stepAmount('12,5',1),'13.5');
 assert.equal(stepAmount('12.5',-1),'11.5');
 assert.equal(stepAmount('0',-1),'0');
 assert.equal(stepAmount('0.5',-1),'0');
 assert.equal(stepAmount('',1),'1');
 assert.equal(stepAmount('abc',1),'1');
});
test('holding repeats and release, cancellation or direction change clears the timer',()=>{
 let value='100',nextId=0;
 const timers=new Map();
 const repeat=createRepeater(direction=>{value=stepAmount(value,direction);},(callback,ms)=>{
  assert.equal(ms,70);const id=nextId++;timers.set(id,callback);return id;
 },id=>timers.delete(id));
 repeat.start(1);assert.equal(value,'101');
 timers.values().next().value();timers.values().next().value();assert.equal(value,'103');
 repeat.start(-1);assert.equal(timers.size,1);assert.equal(value,'102');
 timers.values().next().value();assert.equal(value,'101');
 repeat.stop();assert.equal(timers.size,0);
 repeat.stop();assert.equal(timers.size,0);
});
