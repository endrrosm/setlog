import React,{useRef,useState} from 'react';
import {Animated,View,Text,Pressable,StyleSheet,Modal,ScrollView,useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const sections=[{id:'sport',label:'Spor'},{id:'nutrition',label:'Beslenme'}];
export default function SectionMenu({selected,onChange}){
 const [open,setOpen]=useState(false);
 const progress=useRef(new Animated.Value(0)).current;
 const closing=useRef(false);
 const {width}=useWindowDimensions();
 const drawerWidth=Math.min(320,width*.8);
 const reveal=()=>{closing.current=false;progress.setValue(0);setOpen(true);};
 const close=(nextSection)=>{
  if(closing.current)return;
  closing.current=true;
  Animated.timing(progress,{toValue:0,duration:180,useNativeDriver:true}).start(({finished})=>{
   if(!finished)return;
   setOpen(false);
   closing.current=false;
   if(nextSection)onChange(nextSection);
  });
 };
 const icon=()=> <View style={{gap:5}}>{[0,1,2].map(i=><View key={i} style={s.line}/>)}</View>;
 return <>
  <Pressable accessibilityRole="button" accessibilityLabel="Bölüm menüsünü aç" accessibilityState={{expanded:open}} onPress={reveal} style={s.toggle}>{icon()}</Pressable>
  <Modal visible={open} transparent animationType="none" statusBarTranslucent onRequestClose={()=>close()} onShow={()=>Animated.timing(progress,{toValue:1,duration:220,useNativeDriver:true}).start()}>
   <View style={s.overlay}>
    <Animated.View style={[StyleSheet.absoluteFill,{opacity:progress}]}><Pressable accessibilityRole="button" accessibilityLabel="Bölüm menüsünü kapat" onPress={()=>close()} style={s.backdrop}/></Animated.View>
    <Animated.View accessibilityViewIsModal style={[s.drawer,{width:drawerWidth,transform:[{translateX:progress.interpolate({inputRange:[0,1],outputRange:[-drawerWidth,0]})}]}]}>
     <SafeAreaView style={s.safe}>
      <View style={s.drawerHeader}><View style={s.logo}><Text style={s.logoText}>s.</Text></View><Text style={s.brand}>setlog<Text style={{color:'#d5fa68'}}>.</Text></Text></View>
      <ScrollView contentContainerStyle={s.options}>{sections.map(item=><Pressable key={item.id} accessibilityRole="button" accessibilityState={{selected:selected===item.id}} onPress={()=>close(item.id)} style={[s.option,selected===item.id&&s.activeOption]}><Text style={[s.title,selected===item.id&&s.activeText]}>{item.label}</Text><View accessible={false} style={s.indicator}><View style={[s.chevron,selected===item.id&&s.activeChevron]}/></View></Pressable>)}</ScrollView>
     </SafeAreaView>
    </Animated.View>
   </View>
  </Modal>
 </>;
}
const s=StyleSheet.create({indicator:{width:20,height:20,alignItems:'center',justifyContent:'center'},chevron:{width:8,height:8,borderTopWidth:1.5,borderRightWidth:1.5,borderColor:'#94a08b',transform:[{rotate:'45deg'}]},activeChevron:{borderColor:'#d5fa68'},logo:{width:32,height:32,backgroundColor:'#d5fa68',borderRadius:10,alignItems:'center',justifyContent:'center'},logoText:{fontSize:27,fontWeight:'900',color:'#17200e',marginTop:-4},overlay:{flex:1},backdrop:{flex:1,backgroundColor:'rgba(0,0,0,0.6)'},drawer:{position:'absolute',left:0,top:0,bottom:0,backgroundColor:'#171e15',borderRightWidth:1,borderColor:'#303b29',shadowColor:'#000',shadowOffset:{width:6,height:0},shadowOpacity:.3,shadowRadius:18,elevation:16},safe:{flex:1},drawerHeader:{flexDirection:'row',alignItems:'center',gap:9,paddingHorizontal:16,paddingVertical:18,borderBottomWidth:1,borderColor:'#303b29'},brand:{color:'#f4f5ee',fontSize:25,fontWeight:'800',letterSpacing:-1},toggle:{width:44,height:44,alignItems:'center',justifyContent:'center'},line:{width:22,height:2,backgroundColor:'#d5fa68',borderRadius:2},title:{color:'#e9efdf',fontWeight:'600',fontSize:16},options:{gap:8,padding:20},option:{minHeight:56,padding:16,borderRadius:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},activeOption:{backgroundColor:'#2a3425'},activeText:{color:'#d5fa68'}});
