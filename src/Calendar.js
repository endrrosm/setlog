import React, {useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {localDateKey} from './history';
import {dateLabel} from './format';

export default function Calendar({value,onChange}) {
  const [month,setMonth]=useState(()=>new Date(Number(value.slice(0,4)),Number(value.slice(5,7))-1,1,12));
  const today=localDateKey();
  const offset=(month.getDay()+6)%7;
  const days=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
  const next=new Date(month.getFullYear(),month.getMonth()+1,1,12);
  return <View style={s.container}>
    <View style={s.header}><Pressable accessibilityRole="button" accessibilityLabel="Önceki ay" style={s.arrow} onPress={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1,12))}><Text style={s.arrowText}>‹</Text></Pressable><Text style={s.title}>{month.toLocaleDateString('tr-TR',{month:'long',year:'numeric'})}</Text><Pressable accessibilityRole="button" accessibilityLabel="Sonraki ay" accessibilityState={{disabled:localDateKey(next)>today}} disabled={localDateKey(next)>today} style={[s.arrow,localDateKey(next)>today&&{opacity:.25}]} onPress={()=>setMonth(next)}><Text style={s.arrowText}>›</Text></Pressable></View>
    <View style={s.grid}>{['Pt','Sa','Ça','Pe','Cu','Ct','Pz'].map(day=><View key={day} style={s.cell}><Text style={s.weekday}>{day}</Text></View>)}</View>
    <View style={s.grid}>{Array.from({length:42},(_,index)=>{const day=index-offset+1;if(day<1||day>days)return <View key={index} style={s.cell}/>;const key=localDateKey(new Date(month.getFullYear(),month.getMonth(),day,12));const disabled=key>today;return <Pressable key={index} accessibilityRole="button" accessibilityLabel={key} accessibilityState={{selected:key===value,disabled}} disabled={disabled} onPress={()=>onChange(key)} style={[s.cell,key===value&&s.selected,disabled&&{opacity:.25}]}><Text style={[s.day,key===value&&{color:'#17200e'}]}>{day}</Text></Pressable>;})}</View>
    <Text style={s.chosen}>Seçilen tarih: {dateLabel(new Date(Number(value.slice(0,4)),Number(value.slice(5,7))-1,Number(value.slice(8,10)),12))}</Text>
  </View>;
}
const s=StyleSheet.create({container:{padding:12,borderRadius:14,backgroundColor:'#1d241a',gap:8},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},arrow:{width:44,height:44,alignItems:'center',justifyContent:'center'},arrowText:{color:'#d5fa68',fontSize:30},title:{color:'#f4f5ee',fontWeight:'600',fontSize:16},grid:{flexDirection:'row',flexWrap:'wrap'},cell:{width:'14.285714%',height:44,alignItems:'center',justifyContent:'center',borderRadius:10},weekday:{color:'#94a08b',fontSize:12},day:{color:'#f4f5ee',fontSize:15},selected:{backgroundColor:'#d5fa68'},chosen:{color:'#d5fa68',fontSize:13,textAlign:'center',padding:8}});
