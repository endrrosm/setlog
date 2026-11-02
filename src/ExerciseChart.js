import React,{useState} from 'react';
import {View,Text,Pressable,StyleSheet} from 'react-native';
import {exerciseChartData,weightScale} from './chart';
import {dateLabel} from './format';

const HEIGHT=180;
const kg=value=>value.toLocaleString('tr-TR',{maximumFractionDigits:3});
const axisDate=value=>{const date=new Date(value);return date.toLocaleDateString('tr-TR',{day:'numeric',month:'long'})+' '+date.toLocaleDateString('tr-TR',{weekday:'short'});};
export default function ExerciseChart({sessions,exerciseId}){
 const points=exerciseChartData(sessions,exerciseId),scale=weightScale(points);
 const [width,setWidth]=useState(0),[selectedId,setSelectedId]=useState(null);
 const selected=points.find(point=>point.id===selectedId)||points[points.length-1];
 const x=index=>points.length===1?width/2:18+index*Math.max(0,width-36)/(points.length-1);
 const y=weight=>HEIGHT-(weight-scale.min)/(scale.max-scale.min)*HEIGHT;
 return <View style={s.card}>
  <Text style={s.title}>En yüksek kilo</Text>
  <Text style={s.subtitle}>Son {points.length||7} antrenman · Eskiden yeniye</Text>
  <View style={s.legend}><View style={s.legendItem}><View style={[s.swatch,{backgroundColor:'#c9ec79'}]}/><Text style={s.subtitle}>En yüksek</Text></View><View style={s.legendItem}><View style={[s.swatch,{backgroundColor:'#8b9393'}]}/><Text style={s.subtitle}>En düşük</Text></View></View>
  {!points.length?<Text style={s.empty}>İlk antrenman kaydından sonra kilo grafiğin burada görünecek.</Text>:<>
   <Text style={s.axisTitle}>KG</Text>
   <View style={s.chart}>
    <View style={s.axis}>{scale.ticks.map(value=><Text key={value} style={[s.tick,{top:y(value)-8}]}>{kg(value)}</Text>)}</View>
    <View style={s.plot} onLayout={event=>setWidth(event.nativeEvent.layout.width)}>
     {scale.ticks.map(value=><View key={value} style={[s.grid,{top:y(value)}]}/>)}
     {width>0&&['minWeight','weight'].map(field=>points.slice(1).map((point,index)=>{const x1=x(index),x2=x(index+1),y1=y(points[index][field]),y2=y(point[field]),length=Math.hypot(x2-x1,y2-y1);return <View key={field+point.id} pointerEvents="none" style={[s.line,{backgroundColor:field==='minWeight'?'#8b9393':'#c9ec79',width:length,left:(x1+x2-length)/2,top:(y1+y2)/2-1.5,transform:[{rotate:Math.atan2(y2-y1,x2-x1)+'rad'}]}]}/>;}))}
     {width>0&&points.map((point,index)=><View key={point.id} pointerEvents="none" style={[s.minPoint,{left:x(index)-3,top:y(point.minWeight)-3}]}/>)}
     {width>0&&points.map((point,index)=><React.Fragment key={point.id}><Pressable accessibilityRole="button" accessibilityLabel={`${dateLabel(point.date)}, en yüksek ${kg(point.weight)} kilogram, en düşük ${kg(point.minWeight)} kilogram`} accessibilityState={{selected:selected.id===point.id}} onPress={()=>setSelectedId(point.id)} style={[s.pointTarget,{left:x(index)-18,top:y(point.weight)-18}]}><View style={[s.point,selected.id===point.id&&s.activePoint]}/></Pressable><Pressable accessibilityRole="button" accessibilityLabel={`${dateLabel(point.date)} antrenmanının en yüksek kilosunu göster`} onPress={()=>setSelectedId(point.id)} style={[s.xTarget,{left:x(index)-18}]}><Text numberOfLines={1} style={[s.xLabel,selected.id===point.id&&s.activeText]}>{axisDate(point.date)}</Text></Pressable></React.Fragment>)}
    </View>
   </View>
   <Text style={s.xCaption}>Antrenman tarihi · Ayrıntı için noktaya dokun</Text>
   <View style={s.detail}><Text style={s.value}>{kg(selected.weight)} kg</Text><Text style={s.date}>{dateLabel(selected.date)}</Text><Text style={s.subtitle}>{selected.programName}</Text></View>
  </>}
 </View>;
}
const s=StyleSheet.create({legend:{flexDirection:'row',flexWrap:'wrap',gap:16},legendItem:{flexDirection:'row',alignItems:'center',gap:6},swatch:{width:18,height:3,borderRadius:2},minPoint:{position:'absolute',width:6,height:6,borderRadius:3,backgroundColor:'#8b9393'},card:{backgroundColor:'#1a1f19',borderWidth:1,borderColor:'#2a3227',borderRadius:18,padding:18,gap:10},title:{fontSize:18,fontWeight:'600',color:'#f4f5ee'},subtitle:{fontSize:12,lineHeight:19,color:'#94a08b'},empty:{fontSize:14,lineHeight:23,color:'#94a08b',paddingVertical:14},axisTitle:{fontSize:10,color:'#a1ac94',marginTop:8},chart:{flexDirection:'row',paddingTop:10},axis:{width:44,height:HEIGHT,position:'relative'},tick:{position:'absolute',left:0,right:8,fontSize:10,lineHeight:16,textAlign:'right',color:'#94a08b'},plot:{flex:1,height:HEIGHT+138,position:'relative'},grid:{position:'absolute',left:0,right:0,height:1,backgroundColor:'#303a28'},line:{position:'absolute',height:3,backgroundColor:'#c9ec79',borderRadius:2},pointTarget:{position:'absolute',width:36,height:36,alignItems:'center',justifyContent:'center'},point:{width:9,height:9,borderRadius:5,backgroundColor:'#d5fa68',borderWidth:2,borderColor:'#1a1f19'},activePoint:{width:13,height:13,borderRadius:7,borderColor:'#e8ffbb'},xTarget:{position:'absolute',top:HEIGHT+4,width:36,height:128},xLabel:{position:'absolute',left:-40,top:52,width:116,height:16,lineHeight:16,textAlign:'center',color:'#94a08b',fontSize:10,transform:[{rotate:'-75deg'}]},activeText:{color:'#d5fa68',fontWeight:'700'},xCaption:{color:'#94a08b',fontSize:10,textAlign:'center'},detail:{backgroundColor:'#252f1f',padding:14,borderRadius:12,gap:4},value:{color:'#d5fa68',fontWeight:'700',fontSize:23},date:{color:'#e6eddf',fontSize:12,lineHeight:19}});
