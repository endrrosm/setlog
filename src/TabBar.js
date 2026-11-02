import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';

const tabs=[['today','Bugün'],['programs','Programlar'],['exercises','Hareketler'],['history','Geçmiş']];

function TabIcon({name,color}) {
  const stroke={borderColor:color};
  return <View accessible={false} style={styles.icon}>
    {name==='today'&&<><View style={[styles.todayRing,stroke]}/><View style={[styles.todayCenter,{backgroundColor:color}]}/></>}
    {name==='programs'&&<><View style={[styles.plan,stroke]}/>{[8,13,18].map(top=><View key={top} style={[styles.planLine,{top,backgroundColor:color}]}/>)}</>}
    {name==='exercises'&&<View style={styles.dumbbell}><View style={[styles.bar,{backgroundColor:color}]}/>{[3,17].map(left=><View key={left} style={[styles.weight,stroke,{left}]}/>)}</View>}
    {name==='history'&&<><View style={[styles.calendar,stroke]}/><View style={[styles.calendarRule,{backgroundColor:color}]}/>{[8,17].map(left=><View key={left} style={[styles.calendarRing,{left,backgroundColor:color}]}/>)}{[8,13,18].map(left=><View key={left} style={[styles.calendarDot,{left,backgroundColor:color}]}/>)}</>}
  </View>;
}

export default function TabBar({selected,onChange}) {
  return <View style={styles.container}><View style={styles.barSurface}>
    {tabs.map(([key,label])=>{
      const active=selected===key;
      return <Pressable key={key} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{selected:active}} onPress={()=>onChange(key)} style={({pressed})=>[styles.tab,active&&styles.activeSurface,pressed&&styles.pressed]}>
        <View style={styles.iconSurface}><TabIcon name={key} color={active?'#d5fa68':'#93a18a'}/></View>
        <Text maxFontSizeMultiplier={1.2} numberOfLines={1} style={[styles.label,active&&styles.activeLabel]}>{label}</Text>
      </Pressable>;
    })}
  </View></View>;
}

const styles=StyleSheet.create({
  container:{paddingHorizontal:12,paddingTop:8,paddingBottom:8,backgroundColor:'#111411'},
  barSurface:{flexDirection:'row',paddingHorizontal:4,paddingVertical:8,borderRadius:24,borderWidth:1,borderColor:'#303b29',backgroundColor:'#1a2117',shadowColor:'#000',shadowOffset:{width:0,height:4},shadowOpacity:.18,shadowRadius:12,elevation:5},
  tab:{flex:1,minWidth:0,minHeight:76,marginHorizontal:3,paddingVertical:7,alignItems:'center',justifyContent:'center',gap:6,borderRadius:20,borderWidth:1,borderColor:'transparent'},
  pressed:{opacity:.7},
  iconSurface:{width:56,height:38,borderRadius:14,alignItems:'center',justifyContent:'center',backgroundColor:'transparent'},
  activeSurface:{backgroundColor:'rgba(213,250,104,0.08)',borderColor:'rgba(213,250,104,0.09)'},
  label:{color:'#93a18a',fontSize:11,lineHeight:16,fontWeight:'600',textAlign:'center',includeFontPadding:false},
  activeLabel:{color:'#d5fa68'},
  icon:{width:26,height:26},
  todayRing:{position:'absolute',left:2,top:2,width:22,height:22,borderWidth:2,borderRadius:11},
  todayCenter:{position:'absolute',left:9,top:9,width:8,height:8,borderRadius:4},
  plan:{position:'absolute',left:4,top:2,width:18,height:23,borderWidth:2,borderRadius:4},
  planLine:{position:'absolute',left:9,width:8,height:2,borderRadius:1},
  dumbbell:{width:26,height:26,transform:[{rotate:'-35deg'}]},
  bar:{position:'absolute',left:0,top:12,width:26,height:2,borderRadius:1},
  weight:{position:'absolute',top:5,width:6,height:16,borderWidth:2,borderRadius:2},
  calendar:{position:'absolute',left:2,top:4,width:22,height:21,borderWidth:2,borderRadius:4},
  calendarRule:{position:'absolute',left:4,top:10,width:18,height:2},
  calendarRing:{position:'absolute',top:1,width:2,height:7,borderRadius:1},
  calendarDot:{position:'absolute',top:16,width:2,height:3,borderRadius:1},
});
