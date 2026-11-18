const emptyNutrition=()=>({foods:[],meals:[],entries:[]});
const nutrients=['kcal','carbs','protein','fat'];
function number(value){if(typeof value==='string'&&!value.trim())return NaN;return Number(typeof value==='string'?value.replace(',','.'):value);}
function validAmount(value){return Number.isFinite(number(value))&&number(value)>0;}
function mergeItems(items){
 const merged=new Map();
 for(const item of items){
  const previous=merged.get(item.foodId);
  if(previous){
   if(!validAmount(previous.grams)||!validAmount(item.grams))throw Error('Aynı yemeği eklemeden önce gram miktarını düzeltin.');
   previous.grams=String(Number((number(previous.grams)+number(item.grams)).toFixed(6)));
  }else merged.set(item.foodId,{...item,grams:String(item.grams)});
 }
 return [...merged.values()];
}
function validFood(food){return !!food.name.trim()&&validAmount(food.baseGrams)&&nutrients.every(key=>Number.isFinite(number(food[key]))&&number(food[key])>=0);}
function totals(items){return items.reduce((sum,item)=>{for(const key of nutrients)sum[key]+=number(item.food[key])*number(item.grams)/number(item.food.baseGrams);return sum;},{kcal:0,carbs:0,protein:0,fat:0});}
function snapshot(items,foods){return items.map(item=>{const food=foods.find(f=>f.id===item.foodId);if(!food||!validAmount(item.grams))throw Error('Geçerli bir yemek ve gram miktarı seçin.');return {food:{...food},grams:number(item.grams)};});}
function removeFood(data,id){return {...data,foods:data.foods.filter(f=>f.id!==id),meals:data.meals.map(m=>({...m,items:m.items.filter(i=>i.foodId!==id)}))};}
function groupedConsumption(entries){
 const groups=new Map();
 for(const entry of entries)for(const item of entry.items){
  const group=groups.get(item.food.id)||{food:{...item.food},grams:0,total:{kcal:0,carbs:0,protein:0,fat:0}};
  group.grams+=number(item.grams);
  const values=totals([item]);
  for(const key of nutrients)group.total[key]+=values[key];
  groups.set(item.food.id,group);
 }
 // Weighted values preserve the original totals even if a food definition changed between entries.
 return [...groups.values()].map(group=>({grams:group.grams,food:{...group.food,baseGrams:100,...Object.fromEntries(nutrients.map(key=>[key,group.total[key]*100/group.grams]))}}));
}
function updateConsumption(data,date,slot,items){
 if(items.some(item=>!validAmount(item.grams)))throw Error('Her besin için sıfırdan büyük bir gram miktarı girin.');
 const original=groupedConsumption(data.entries.filter(entry=>entry.date===date&&entry.slot===slot));
 const ratios=new Map(items.map(item=>{
  const previous=original.find(row=>row.food.id===item.food.id);
  if(!previous)throw Error('Tüketim kaydı bulunamadı.');
  return [item.food.id,number(item.grams)/previous.grams];
 }));
 return {...data,entries:data.entries.flatMap(entry=>{
  if(entry.date!==date||entry.slot!==slot)return [entry];
  const updated=entry.items.filter(item=>ratios.has(item.food.id)).map(item=>({...item,grams:number(item.grams)*ratios.get(item.food.id)}));
  return updated.length?[{...entry,items:updated}]:[];
 })};
}
module.exports={emptyNutrition,nutrients,number,validAmount,validFood,totals,snapshot,removeFood,mergeItems,groupedConsumption,updateConsumption};
