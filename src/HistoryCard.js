import React, {useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {sessionDateLabel,sessionProgress} from './format';
import {sessionSummary} from './training';
import {RecordDetails} from './SessionExercise';

export default function HistoryCard({session,onDelete,onExercise}) {
  const [expanded,setExpanded]=useState(false);
  const progress=sessionProgress(session);
  return <Pressable style={s.card} accessibilityRole="button" accessibilityLabel={`${sessionDateLabel(session)}, ${session.programName}, yüzde ${progress} tamamlandı`} accessibilityState={{expanded}} onPress={()=>setExpanded(value=>!value)}>
    <View style={s.header}>
      <View style={s.summary}>
        <Text style={s.date}>{sessionDateLabel(session)}</Text>
        <Text style={s.title}>{session.programName}</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={session.programName+' kaydını sil'} hitSlop={{top:5,bottom:5,left:5,right:5}} style={s.deleteButton} onPress={event=>{event.stopPropagation();onDelete();}}><Text style={s.deleteText}>Sil</Text></Pressable>
    </View>
    <View style={s.progressRow}><View style={s.progressInfo}><Text style={s.percentage}>%{progress} tamamlandı</Text><View style={s.track}><View style={[s.fill,{width:progress+'%'}]}/></View></View><View style={s.arrowArea}><View style={[s.arrow,{transform:[{rotate:expanded?'225deg':'45deg'}]}]}/></View></View>
    {expanded&&<View style={s.details}><Text style={s.muted}>{sessionSummary(session)} tamamlandı</Text>{session.exercises.map(exercise=><View key={exercise.exerciseId} style={s.exercise}><Pressable accessibilityRole="button" onPress={event=>{event.stopPropagation();onExercise(exercise.exerciseId);}}><Text style={s.accent}>{exercise.name} ↗</Text></Pressable><RecordDetails exercise={exercise}/></View>)}</View>}
  </Pressable>;
}
const s=StyleSheet.create({
  card:{padding:20,borderRadius:18,borderWidth:1,borderColor:'#2a3227',backgroundColor:'#1a1f19'},
  header:{flexDirection:'row',alignItems:'flex-start',gap:12},
  summary:{flex:1,gap:12},
  date:{color:'#a1ac94',fontSize:12,lineHeight:20},
  title:{color:'#f4f5ee',fontSize:17,fontWeight:'600',lineHeight:25},
  progressRow:{flexDirection:'row',alignItems:'center',gap:16,marginTop:12},
  progressInfo:{flex:1,gap:10},
  percentage:{color:'#d5fa68',fontSize:12,fontWeight:'600'},
  arrowArea:{width:44,height:44,alignItems:'center',justifyContent:'center'},
  arrow:{width:16,height:16,borderBottomWidth:2.5,borderRightWidth:2.5,borderColor:'#b7d877'},
  track:{height:4,borderRadius:4,overflow:'hidden',backgroundColor:'#303b28'},
  fill:{height:4,backgroundColor:'#b7d877'},
  deleteButton:{minHeight:44,minWidth:40,alignItems:'flex-end',justifyContent:'flex-start',paddingTop:3},
  deleteText:{color:'#e3a092',fontSize:12},
  details:{gap:14,paddingTop:18},
  exercise:{borderTopWidth:1,borderColor:'#303a28',paddingTop:14,gap:8},
  muted:{color:'#94a08b',fontSize:13,lineHeight:20},
  accent:{color:'#d5fa68',fontSize:13,fontWeight:'600',lineHeight:21},
  setText:{color:'#f4f5ee'},
});
