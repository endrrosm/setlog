import React,{useEffect,useRef} from 'react';
import {View,Text,TextInput,Pressable,StyleSheet,AppState} from 'react-native';
import {stepAmount,createRepeater} from './amountStepper';

export default function GramInput({label,value,onChangeText,unit='g'}){
 const current=useRef(String(value??''));
 const change=useRef(onChangeText);
 const held=useRef(false);
 current.current=String(value??'');
 change.current=onChangeText;
 const repeater=useRef(null);
 const step=direction=>{const next=stepAmount(current.current,direction);current.current=next;change.current(next);};
 if(!repeater.current)repeater.current=createRepeater(step);
 const stop=()=>repeater.current.stop();
 useEffect(()=>{
  const subscription=AppState.addEventListener('change',state=>{if(state!=='active')repeater.current.stop();});
  return()=>{repeater.current.stop();subscription.remove();};
 },[]);
 const control=direction=><Pressable accessibilityRole="button" accessibilityLabel={label+' bir '+(unit==='g'?'gram':unit)+(direction>0?' artır':' azalt')} accessibilityHint="Hızlı değiştirmek için basılı tut" delayLongPress={350}
  onPressIn={()=>{stop();held.current=false;}}
  onLongPress={()=>{held.current=true;repeater.current.start(direction);}}
  onPressOut={stop} onBlur={stop}
  onPress={()=>{if(!held.current)step(direction);}}
  style={({pressed})=>[s.control,pressed&&s.pressed]}><Text style={s.sign}>{direction>0?'+':'−'}</Text></Pressable>;
 return <View style={s.field}><Text style={s.label}>{label}</Text><View style={s.box}>
  {control(-1)}
  <View style={s.center}><TextInput accessibilityLabel={label} keyboardType="decimal-pad" value={String(value??'')} onFocus={stop} onChangeText={text=>{stop();current.current=text;change.current(text);}} selectTextOnFocus style={[s.input,{width:Math.min(128,Math.max(52,String(value??'').length*12+12))}]}/><Text style={s.unit}>{unit}</Text></View>
  {control(1)}
 </View></View>;
}
const s=StyleSheet.create({
 field:{gap:8},label:{color:'#93a185',fontSize:10,fontWeight:'600',letterSpacing:1},
 box:{flexDirection:'row',alignItems:'center',minHeight:56,borderWidth:1,borderColor:'#43523a',borderRadius:12,backgroundColor:'#1d241a',overflow:'hidden'},
 control:{width:48,alignSelf:'stretch',minHeight:54,alignItems:'center',justifyContent:'center',backgroundColor:'#2a3425'},pressed:{backgroundColor:'#3b4c2d'},
 sign:{color:'#d5fa68',fontSize:26,lineHeight:30,fontWeight:'500',includeFontPadding:false},
 center:{flex:1,minWidth:0,flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:4},
 input:{minWidth:0,flexShrink:1,maxWidth:'85%',paddingVertical:12,paddingHorizontal:0,color:'#f5f5ee',fontSize:18,lineHeight:24,fontWeight:'600',textAlign:'center'},
 unit:{color:'#a2ae98',fontSize:15,lineHeight:24,marginLeft:2},
});
