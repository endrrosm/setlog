import React,{createContext,useCallback,useContext,useEffect,useRef,useState} from 'react';
import {View,Text,Pressable,ScrollView,StyleSheet,Keyboard,BackHandler,useWindowDimensions} from 'react-native';
const DropdownContext=createContext(null);

// Both measurements belong to the same native window; never duplicate the trigger.
export function DropdownHost({children,style}){
 const root=useRef(null),[menu,setMenu]=useState(null);
 const {width,height}=useWindowDimensions();
 const close=useCallback(()=>setMenu(null),[]);
 const show=useCallback((owner,trigger,options,value,onChange)=>{
  Keyboard.dismiss();
  root.current?.measureInWindow((rootX,rootY,rootWidth,rootHeight)=>{
   trigger.current?.measureInWindow((x,y,w,h)=>setMenu({owner,options,value,onChange,left:x-rootX,top:y-rootY+h+6,width:w,maxHeight:Math.max(0,Math.min(320,rootHeight-(y-rootY+h+6)-8))}));
  });
 },[]);
 useEffect(close,[width,height,close]);
 useEffect(()=>{if(!menu)return;const subscription=BackHandler.addEventListener('hardwareBackPress',()=>{close();return true;});return()=>subscription.remove();},[menu,close]);
 return <DropdownContext.Provider value={{menu,show,close}}><View ref={root} collapsable={false} style={style}>
  {children}
  {menu&&<View style={StyleSheet.absoluteFill} pointerEvents="box-none">
   <Pressable style={StyleSheet.absoluteFill} accessibilityRole="button" accessibilityLabel="Program menüsünü kapat" onPress={close}/>
   <View style={[s.menu,{left:menu.left,top:menu.top,width:menu.width,maxHeight:menu.maxHeight}]}>
    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" contentContainerStyle={s.options}>
     {menu.options.map(program=>{const active=program.id===menu.value;return <Pressable key={program.id} accessibilityRole="radio" accessibilityState={{checked:active}} onPress={()=>{menu.onChange(program.id);close();}} style={[s.option,active&&s.activeOption]}><Text style={[s.name,active&&s.activeName]}>{program.name}</Text></Pressable>;})}
     {!menu.options.length&&<Text style={s.empty}>Seçilebilir program yok. Programlar sekmesinden hareket içeren bir program oluştur.</Text>}
    </ScrollView>
   </View>
  </View>}
 </View></DropdownContext.Provider>;
}
export default function ProgramSelect({programs,value,onChange,label='Antrenman programı seç'}) {
 const trigger=useRef(null),owner=useRef({}).current;
 const {menu,show,close}=useContext(DropdownContext);
 const options=programs.filter(program=>program.exercises.length>0);
 const selected=options.find(program=>program.id===value),expanded=menu?.owner===owner;
 useEffect(()=>()=>close(),[close]);
 return <View ref={trigger} collapsable={false}><Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{expanded:!!expanded}} onPress={()=>expanded?close():show(owner,trigger,options,value,onChange)} style={[s.trigger,selected&&s.selectedTrigger]}><Text style={s.name}>{selected?.name||'Program seç'}</Text><Text style={s.chevron}>{expanded?'⌃':'⌄'}</Text></Pressable></View>;
}
const s=StyleSheet.create({
 trigger:{flexDirection:'row',alignItems:'center',gap:12,minHeight:58,padding:16,borderWidth:1,borderColor:'#36422f',borderRadius:14,backgroundColor:'#1d241a'},
 selectedTrigger:{backgroundColor:'rgba(213,250,104,0.08)',borderColor:'rgba(213,250,104,0.16)'},
 name:{flex:1,color:'#f4f5ee',fontSize:17,lineHeight:25,fontWeight:'600'},
 chevron:{color:'#b8ca9c',fontSize:19},
 menu:{position:'absolute',backgroundColor:'#20271c',borderRadius:16,borderWidth:1,borderColor:'#3d4933',overflow:'hidden',shadowColor:'#000',shadowOpacity:.3,shadowRadius:18,shadowOffset:{width:0,height:8},elevation:12},
 options:{padding:8,gap:4},
 option:{minHeight:56,padding:14,borderRadius:12,borderWidth:1,borderColor:'transparent'},
 activeOption:{backgroundColor:'rgba(213,250,104,0.09)',borderColor:'rgba(213,250,104,0.12)'},
 activeName:{color:'#d5fa68'},
 empty:{padding:14,color:'#a1ac94',fontSize:14,lineHeight:22},
});
