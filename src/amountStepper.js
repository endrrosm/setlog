function stepAmount(value,direction){
 const parsed=Number(String(value).replace(',','.'));
 const current=Number.isFinite(parsed)?parsed:0;
 return String(Math.max(0,Number((current+direction).toFixed(6))));
}
function createRepeater(step,schedule=setInterval,cancel=clearInterval){
 let timer=null;
 const stop=()=>{if(timer!==null)cancel(timer);timer=null;};
 return {stop,start(direction){stop();step(direction);timer=schedule(()=>step(direction),70);}};
}
module.exports={stepAmount,createRepeater};
