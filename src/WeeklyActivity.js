import React,{useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {View,Text,Pressable,PanResponder,Animated,StyleSheet} from 'react-native';
import {localDateKey} from './history';
import {dateLabel} from './format';
import {workoutCounts,weekDays,currentStreak,moveCalendar,swipeDays,shiftDay} from './activity';

export default function WeeklyActivity({sessions}){
 const today=new Date(),todayKey=localDateKey(today);
 const counts=workoutCounts(sessions),streak=currentStreak(counts,today);
 const [offset,setOffset]=useState(0),[width,setWidth]=useState(0);
 const [busy,setBusy]=useState(false),busyRef=useRef(false),mounted=useRef(true);
 const translation=useRef(new Animated.Value(0)).current;
 const days=weekDays(today,offset);
 const total=days.reduce((sum,date)=>sum+(counts[localDateKey(date)]||0),0);
 const strip=Array.from({length:21},(_,index)=>shiftDay(today,offset-13+index));
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;translation.stopAnimation();};},[translation]);
 useLayoutEffect(()=>{translation.setValue(0);busyRef.current=false;setBusy(false);},[offset,width,translation]);
 const finish=target=>{
  busyRef.current=true;setBusy(true);
  Animated.timing(translation,{toValue:-(target-offset)*(width/7),duration:180,useNativeDriver:false}).start(({finished})=>{
   if(!finished||!mounted.current)return;
   if(target===offset){translation.setValue(0);busyRef.current=false;setBusy(false);}
   else setOffset(target);
  });
 };
 const navigate=target=>{if(busyRef.current)return;if(Math.abs(target-offset)>7||!width)setOffset(target);else finish(target);};
 const move=delta=>navigate(moveCalendar(offset,delta));
 const dragDistance=dx=>Math.max(Math.max(-width,offset*width/7),Math.min(width,dx));
 const pan=useMemo(()=>PanResponder.create({
  onMoveShouldSetPanResponder:(_,gesture)=>!busyRef.current&&Math.abs(gesture.dx)>10&&Math.abs(gesture.dx)>Math.abs(gesture.dy)*1.5,
  onPanResponderGrant:()=>{busyRef.current=true;setBusy(true);},
  onPanResponderMove:(_,gesture)=>translation.setValue(dragDistance(gesture.dx)),
  onPanResponderRelease:(_,gesture)=>finish(moveCalendar(offset,swipeDays(dragDistance(gesture.dx),width))),
  onPanResponderTerminate:()=>finish(offset),
  onPanResponderTerminationRequest:()=>true,
 }),[width,offset]);
 return <View style={s.card}>
  <View style={s.heading}><Text style={s.title}>Antrenman takvimin</Text><Pressable accessibilityRole="button" disabled={busy} onPress={()=>navigate(0)} style={s.touch}><Text style={s.link}>Bugüne dön</Text></Pressable></View>
  <View style={s.heading}><Pressable accessibilityRole="button" accessibilityLabel="Bir gün geri" disabled={busy} style={s.touch} onPress={()=>move(-1)}><Text style={s.arrow}>‹</Text></Pressable><Text style={s.range}>{days[0].toLocaleDateString('tr-TR',{day:'numeric',month:'short'})} — {days[6].toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'})}</Text><Pressable accessibilityRole="button" accessibilityLabel="Bir gün ileri" disabled={offset===0||busy} style={[s.touch,offset===0&&{opacity:.25}]} onPress={()=>move(1)}><Text style={s.arrow}>›</Text></Pressable></View>
  <View style={{overflow:'hidden',minHeight:99}} onLayout={event=>setWidth(event.nativeEvent.layout.width)} {...pan.panHandlers}>
   {width>0&&<Animated.View style={{flexDirection:'row',width:width*3,transform:[{translateX:Animated.add(translation,-width)}]}}>{strip.map((date,index)=>{const key=localDateKey(date),count=counts[key]||0;return <View key={key} style={{width:width/7,paddingHorizontal:1.5}}><View accessible={index>=7&&index<14} accessibilityElementsHidden={index<7||index>=14} importantForAccessibility={index>=7&&index<14?'auto':'no-hide-descendants'} accessibilityLabel={dateLabel(date)+', '+count+' antrenman'} style={[s.day,key===todayKey&&s.today]}><Text style={s.weekday}>{date.toLocaleDateString('tr-TR',{weekday:'short'})}</Text><Text style={[s.number,key===todayKey&&s.link]}>{date.getDate()}</Text><Text style={s.flame}>{count?'🔥':'·'}</Text></View></View>;})}</Animated.View>}
  </View>
  <View style={s.stats}><View style={s.stat}><Text style={s.value}>{total}<Text style={s.unit}> antrenman</Text></Text><Text style={s.caption}>Görünen 7 günde</Text></View><View style={s.divider}/><View style={s.stat}><Text style={s.value}>{streak}<Text style={s.unit}> gün</Text></Text><Text style={s.caption}>Güncel seri</Text></View></View>
  <Text style={s.note}>Gün gün ilerlemek için sağa/sola kaydır. Seri, bugün veya dün biten ardışık antrenman günlerini sayar.</Text>
 </View>;
}
const s=StyleSheet.create({card:{padding:16,gap:12,borderRadius:18,backgroundColor:'#1a1f19',borderWidth:1,borderColor:'#2a3227'},heading:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:6},title:{color:'#f4f5ee',fontSize:16,fontWeight:'600',flex:1},touch:{minWidth:36,minHeight:44,justifyContent:'center',alignItems:'center'},link:{color:'#d5fa68',fontSize:12,fontWeight:'600'},arrow:{fontSize:27,color:'#d5fa68'},range:{color:'#a1ac94',fontSize:11,flex:1,textAlign:'center'},days:{flexDirection:'row',gap:3},day:{flex:1,minWidth:0,paddingVertical:10,gap:8,alignItems:'center',borderRadius:12,borderWidth:1,borderColor:'transparent'},today:{backgroundColor:'#28331f',borderColor:'#455735'},weekday:{color:'#94a08b',fontSize:10},number:{color:'#f4f5ee',fontSize:16,fontWeight:'600'},flame:{fontSize:18,lineHeight:24,color:'#606e55'},stats:{flexDirection:'row',paddingTop:16,borderTopWidth:1,borderColor:'#303a28',gap:14},stat:{flex:1,gap:5},value:{color:'#d5fa68',fontSize:26,fontWeight:'700'},unit:{color:'#a1ac94',fontSize:11,fontWeight:'400'},caption:{color:'#94a08b',fontSize:11},divider:{width:1,backgroundColor:'#303a28'},note:{color:'#7d8b73',fontSize:10,lineHeight:16}});
