const {test}=require('node:test');
const assert=require('node:assert/strict');
const {validFood,validAmount,totals,snapshot,removeFood,mergeItems,groupedConsumption,updateConsumption}=require('../src/nutritionModel');
const food={id:'a',name:'Yulaf',baseGrams:100,kcal:380,carbs:60,protein:14,fat:7};
test('consumption groups repeated foods and editing scales saved snapshots without changing other meals',()=>{
 const day='2026-11-18';
 const entries=[
  {id:'1',date:day,slot:'breakfast',items:[{food:{...food},grams:100}]},
  {id:'2',date:day,slot:'breakfast',items:[{food:{...food,kcal:400},grams:50},{food:{...food,id:'b'},grams:20}]},
  {id:'3',date:day,slot:'lunch',items:[{food:{...food},grams:100}]},
  {id:'4',date:'2026-11-17',slot:'breakfast',items:[{food:{...food},grams:100}]}
 ];
 const data={foods:[],meals:[],entries};
 const grouped=groupedConsumption(entries.slice(0,2));
 assert.equal(grouped.length,2);
 assert.equal(grouped[0].grams,150);
 assert.equal(totals([grouped[0]]).kcal,580);
 const edited=updateConsumption(data,day,'breakfast',[{...grouped[0],grams:'75'}]);
 const result=groupedConsumption(edited.entries.filter(e=>e.slot==='breakfast'&&e.date===day));
 assert.equal(result.length,1);
 assert.equal(result[0].grams,75);
 assert.equal(totals(result).kcal,290);
 assert.equal(edited.entries[2],entries[2]);
 assert.equal(edited.entries[3],entries[3]);
 assert.equal(entries[0].items[0].grams,100);
 assert.deepEqual(updateConsumption(data,day,'breakfast',[]).entries,entries.slice(2));
 for(const grams of ['',0,-1,'abc'])assert.throws(()=>updateConsumption(data,day,'breakfast',[{...grouped[0],grams}]));
});
test('repeated foods and overlapping saved meals merge grams without changing originals',()=>{
 const first=[{foodId:'a',grams:'12,5'},{foodId:'b',grams:20}];
 const result=mergeItems([...first,{foodId:'a',grams:100},{foodId:'b',grams:'30'},{foodId:'a',grams:'0.5'}]);
 assert.deepEqual(result,[{foodId:'a',grams:'113'},{foodId:'b',grams:'50'}]);
 assert.equal(first[0].grams,'12,5');
 assert.equal(totals(snapshot(result.slice(0,1),[food])).kcal,429.4);
 assert.deepEqual(mergeItems([{foodId:'a',grams:'0.1'},{foodId:'a',grams:'0.2'}]),[{foodId:'a',grams:'0.3'}]);
 assert.throws(()=>mergeItems([{foodId:'a',grams:''},{foodId:'a',grams:100}]));
});
test('nutrition scales every nutrient by the editable reference amount and sums foods',()=>{
 assert.deepEqual(totals([{food,grams:50},{food:{...food,baseGrams:200},grams:100}]),{kcal:380,carbs:60,protein:14,fat:7});
 assert.equal(totals([{food,grams:'12,5'}]).kcal,47.5);
 assert.deepEqual(totals([]),{kcal:0,carbs:0,protein:0,fat:0});
});
test('nutrition validates quantities and permits zero nutrients',()=>{
 assert.equal(validFood(food),true);
 for(const value of ['',0,-2,'abc',Infinity])assert.equal(validAmount(value),false);
 for(const patch of [{name:' '},{baseGrams:0},{kcal:-1},{fat:''},{protein:'abc'}])assert.equal(validFood({...food,...patch}),false);
 assert.equal(validFood({...food,fat:0,baseGrams:'12,5'}),true);
});
test('consumption snapshots survive food edits and deletion; templates lose deleted references',()=>{
 const definition={...food};
 const items=snapshot([{foodId:'a',grams:'75'}],[definition]);
 definition.kcal=1;
 assert.equal(totals(items).kcal,285);
 const entries=[{id:'e',items}];
 const next=removeFood({foods:[definition],meals:[{id:'m',items:[{foodId:'a',grams:75},{foodId:'b',grams:20}]}],entries},'a');
 assert.deepEqual(next.foods,[]);
 assert.deepEqual(next.meals[0].items,[{foodId:'b',grams:20}]);
 assert.equal(next.entries,entries);
 assert.equal(totals(next.entries[0].items).kcal,285);
 assert.throws(()=>snapshot([{foodId:'missing',grams:10}],[food]));
 assert.throws(()=>snapshot([{foodId:'a',grams:0}],[food]));
});
