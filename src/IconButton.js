import React,{useRef,useState} from 'react';
import {View,Text,Pressable,Modal,StyleSheet,useWindowDimensions} from 'react-native';
import {TabIcon} from './TabBar';

export default function IconButton({icon,label,hint,onPress,danger=false}){
 const anchor=useRef(null);
 const held=useRef(false);
 const [tooltip,setTooltip]=useState(null);
 const screen=useWindowDimensions();
 const color=danger?'#ed9b91':'#d5fa68';
 function showHint(event){
  event.stopPropagation();
  held.current=true;
  anchor.current?.measureInWindow((x,y,width,height)=>{
   setTooltip({
    left:Math.max(12,Math.min(screen.width-212,x+width-200)),
    top:Math.max(12,Math.min(screen.height-70,y+height+8))
   });
  });
 }
 return <>
  <Pressable ref={anchor} collapsable={false} accessibilityRole="button" accessibilityLabel={label}
   accessibilityHint="Açıklama için basılı tut" hitSlop={4}
   onPressIn={()=>{held.current=false;}}
   delayLongPress={450} onLongPress={showHint}
   onPress={event=>{event.stopPropagation();if(!held.current)onPress();}}
   style={({pressed})=>[s.button,danger&&s.danger,pressed&&{opacity:.65}]}>
   {icon==='calendar'?<View style={{transform:[{scale:.8}]}}><TabIcon name="history" color={color}/></View>:icon==='swap'?<View accessible={false} style={s.swap}>
     <View style={[s.arrowLine,{top:5,backgroundColor:color}]}/>
     <View style={[s.arrowHead,{right:2,top:2,borderColor:color,transform:[{rotate:'45deg'}]}]}/>
     <View style={[s.arrowLine,{bottom:5,backgroundColor:color}]}/>
     <View style={[s.arrowHead,{left:2,bottom:2,borderColor:color,transform:[{rotate:'225deg'}]}]}/>
    </View>:
    <View accessible={false} style={s.icon}>
     <View style={[s.bin,{borderColor:color}]}/>
     <View style={[s.lid,{backgroundColor:color}]}/>
     <View style={[s.handle,{borderColor:color}]}/>
     {[10,15].map(left=><View key={left} style={[s.line,{left,backgroundColor:color}]}/>)}
    </View>}
  </Pressable>
  {tooltip&&<Modal transparent visible animationType="fade" onRequestClose={()=>setTooltip(null)}>
   <View style={{flex:1}}>
    <Pressable accessibilityRole="button" accessibilityLabel="Bilgi kutusunu kapat" style={StyleSheet.absoluteFill} onPress={()=>setTooltip(null)}/>
    <View accessibilityLiveRegion="polite" style={[s.tooltip,tooltip,danger&&{borderColor:'#70443e'}]}>
     <Text style={[s.hint,{color}]}>{hint}</Text>
    </View>
   </View>
  </Modal>}
 </>;
}
const s=StyleSheet.create({
 button:{width:36,height:36,borderRadius:10,borderWidth:1,borderColor:'#39452f',backgroundColor:'#263020',alignItems:'center',justifyContent:'center'},
 danger:{width:30,height:30,borderRadius:8,backgroundColor:'#34221f',borderColor:'#5b3933'},
 swap:{width:22,height:20},
 arrowLine:{position:'absolute',left:2,right:2,height:2,borderRadius:1},
 arrowHead:{position:'absolute',width:8,height:8,borderTopWidth:2,borderRightWidth:2},
 icon:{width:26,height:26,transform:[{scale:.65}]},
 bin:{position:'absolute',left:6,top:8,width:15,height:16,borderWidth:2,borderTopWidth:0,borderBottomLeftRadius:4,borderBottomRightRadius:4},
 lid:{position:'absolute',left:3,top:5,width:21,height:2,borderRadius:1},
 handle:{position:'absolute',left:10,top:1,width:7,height:5,borderWidth:2,borderBottomWidth:0,borderTopLeftRadius:2,borderTopRightRadius:2},
 line:{position:'absolute',top:11,width:2,height:9,borderRadius:1},
 tooltip:{position:'absolute',width:200,padding:12,borderRadius:12,backgroundColor:'#222b1e',borderWidth:1,borderColor:'#48563c',elevation:8,shadowColor:'#000',shadowOpacity:.25,shadowRadius:8,shadowOffset:{width:0,height:3}},
 hint:{fontSize:13,lineHeight:19,textAlign:'center',fontWeight:'500'}
});
