import React from 'react';
import {View,Text,StyleSheet} from 'react-native';

export default function MealIcon({id}){
 return <View accessible={false} style={s.icon}>
  {id==='breakfast'&&<>
   <View style={s.clock}/><View style={s.hour}/><View style={s.minute}/>
   <View style={[s.bell,{left:1,transform:[{rotate:'-35deg'}]}]}/><View style={[s.bell,{right:1,transform:[{rotate:'35deg'}]}]}/>
   <View style={[s.foot,{left:4,transform:[{rotate:'35deg'}]}]}/><View style={[s.foot,{right:4,transform:[{rotate:'-35deg'}]}]}/>
  </>}
  {id==='lunch'&&<><View style={s.sunCenter}/>{Array.from({length:8},(_,i)=><View key={i} style={[s.rayAxis,{transform:[{rotate:`${i*45}deg`}]}]}><View style={s.ray}/></View>)}</>}
  {id==='dinner'&&<View style={s.moon}><View style={s.moonCutout}/></View>}
  {id==='snack'&&<Text style={s.star}>✦</Text>}
 </View>;
}
const color='#d5fa68';
const s=StyleSheet.create({
 icon:{width:22,height:22,flexShrink:0,alignItems:'center',justifyContent:'center'},
 clock:{position:'absolute',left:3,top:5,width:16,height:16,borderWidth:1.5,borderColor:color,borderRadius:8},
 hour:{position:'absolute',left:10,top:8,width:1.5,height:6,backgroundColor:color,borderRadius:1},
 minute:{position:'absolute',left:10,top:12,width:5,height:1.5,backgroundColor:color,borderRadius:1},
 bell:{position:'absolute',top:1,width:7,height:4,borderTopLeftRadius:5,borderTopRightRadius:5,backgroundColor:color},
 foot:{position:'absolute',bottom:0,width:1.5,height:4,backgroundColor:color},
 sunCenter:{position:'absolute',left:6,top:6,width:10,height:10,borderRadius:5,borderWidth:1.5,borderColor:color},
 rayAxis:{position:'absolute',left:10,top:0,width:2,height:22},
 ray:{width:2,height:4,borderRadius:1,backgroundColor:color},
 moon:{width:20,height:20,borderRadius:10,backgroundColor:color,overflow:'hidden',transform:[{rotate:'-20deg'}]},
 moonCutout:{position:'absolute',left:7,top:-3,width:18,height:18,borderRadius:9,backgroundColor:'#1a2119'},
 star:{color,fontSize:24,lineHeight:26,textAlign:'center',includeFontPadding:false},
});
