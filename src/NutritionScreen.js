import React,{useEffect,useState} from 'react';
import {View,Text,TextInput,Pressable,ScrollView,Modal,StyleSheet,KeyboardAvoidingView,Platform,AppState} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {uid} from './model';
import TabBar from './TabBar';
import GramInput from './GramInput';
import MealIcon from './MealIcon';
import {DropdownSelect,DropdownHost} from './ProgramSelect';
import Calendar from './Calendar';
import {localDateKey,historicalDate} from './history';
import {dateLabel} from './format';
import {shiftDay,selectDay} from './nutritionCalendar';
import {emptyNutrition,nutrients,number,validAmount,validFood,totals,snapshot,removeFood,saveFood,mergeItems,groupedConsumption,updateConsumption} from './nutritionModel';

const slots=[['breakfast','Kahvaltı'],['lunch','Öğle yemeği'],['dinner','Akşam yemeği'],['snack','Ara öğünler / Diğer']];
const tabs=[['today','Bugün'],['meals','Kayıtlı öğünler'],['foods','Yemekler'],['history','Geçmiş']];
const labels={kcal:'Kalori',carbs:'Karb',protein:'Protein',fat:'Yağ'};
const fmt=value=>Number(value.toFixed(1)).toLocaleString('tr-TR');
const dayLabel=key=>new Date(key+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'});
function RemoveButton({label,onPress}){return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({pressed})=>[s.removeButton,pressed&&{opacity:.65}]}><Text style={s.removeIcon}>×</Text></Pressable>;}
function DayArrow({forward=false,disabled=false,onPress,jump=false}){return <Pressable accessibilityRole="button" accessibilityLabel={jump?(forward?'Bugüne dön':'Yedi gün geri'):forward?'Sonraki gün':'Önceki gün'} accessibilityState={{disabled}} disabled={disabled} onPress={onPress} style={[s.dayArrow,disabled&&{opacity:.3}]}><View style={s.arrowIcons}>{Array.from({length:jump?2:1},(_,i)=><View key={i} style={[s.chevron,{transform:[{rotate:forward?'135deg':'-45deg'}]}]}/>)}</View></Pressable>;}
function Button({title,onPress,secondary=false}){return <Pressable accessibilityRole="button" onPress={onPress} style={[s.button,secondary&&s.secondary]}><Text style={[s.buttonText,secondary&&s.text]}>{title}</Text></Pressable>;}
function Field({label,value,onChangeText,numeric=false}){return <View style={{gap:7,flex:1}}><Text style={s.label}>{label}</Text><TextInput accessibilityLabel={label} style={s.input} value={String(value??'')} onChangeText={onChangeText} keyboardType={numeric?'decimal-pad':'default'} placeholderTextColor="#94a08b"/></View>;}
function Macros({items,total}){const values=total||totals(items);return <View style={s.macros}>{nutrients.map(key=><View key={key} style={{flex:1,gap:5}}><Text style={s.muted}>{labels[key]}</Text><Text style={key==='kcal'?s.accent:s.text}>{fmt(values[key])}<Text style={s.unit}> {key==='kcal'?'kcal':'g'}</Text></Text></View>)}</View>;}

export default function Nutrition({data,onChange}){
 const nutrition=data||emptyNutrition();
 const [tab,setTab]=useState('today'),[modal,setModal]=useState(null),[error,setError]=useState(''),[search,setSearch]=useState('');
 const [today,setToday]=useState(localDateKey),[date,setDate]=useState(localDateKey),[week,setWeek]=useState(localDateKey);
 const chooseDate=next=>{const selection=selectDay(next,week,today);setDate(selection.date);setWeek(selection.week);};
 const [slot,setSlot]=useState('breakfast'),[expanded,setExpanded]=useState({breakfast:true});
 useEffect(()=>{const refresh=()=>setToday(localDateKey());const timer=setInterval(refresh,30000);const subscription=AppState.addEventListener('change',refresh);return()=>{clearInterval(timer);subscription.remove();};},[]);
 useEffect(()=>{if(!error)return;const timer=setTimeout(()=>setError(''),5000);return()=>clearTimeout(timer);},[error]);
 const update=fn=>onChange(current=>fn(current||emptyNutrition()));
 const open=value=>{setError('');setModal(value);};
 const closeModal=()=>{setError('');setModal(current=>current?.parent||null);};
 const patch=value=>setModal(current=>({...current,...value}));
 const activeDate=tab==='history'?date:today;
 const entries=nutrition.entries.filter(e=>e.date===activeDate);
 const openFood=(food,parent=null)=>open({type:'food',parent,id:food?.id,name:food?.name||'',baseGrams:String(food?.baseGrams??100),...Object.fromEntries(nutrients.map(k=>[k,String(food?.[k]??0)]))});
 const openMeal=(meal,parent=null)=>open({type:'meal',parent,id:meal?.id,name:meal?.name||'',items:mergeItems(meal?.items||[]),query:''});
 const openLog=()=>open({type:'log',slot,date:today,items:[],query:'',source:'meals'});
 const save=()=>{
  if(modal.type==='pastMeal'){
   if(!historicalDate(modal.date)){setError('Bugün veya geçmiş bir tarih seçin.');return;}
   if(!slots.some(([id])=>id===modal.slot)){setError('Bir öğün vakti seçin.');return;}
   open({type:'log',slot:modal.slot,date:modal.date,items:[],query:'',source:'meals',historical:true});
   return;
  }
  if(modal.type==='log'&&(!historicalDate(modal.date)||!slots.some(([id])=>id===modal.slot))){setError('Geçerli bir tarih ve öğün vakti seçin.');return;}

  if(modal.type==='editConsumption'){
   try{const next=updateConsumption(nutrition,modal.date,modal.slot,modal.items);update(()=>next);setModal(null);setError('');}
   catch(e){setError(e.message);}
   return;
  }
  let createdItems=[],createdMealId=null;
  if(modal.type==='food'){
   if(!validFood(modal)){setError('Yemek adı, sıfırdan büyük gram miktarı ve sıfır veya üzeri besin değerleri girin.');return;}
   if(nutrition.foods.some(f=>f.id!==modal.id&&f.name.toLocaleLowerCase('tr-TR')===modal.name.trim().toLocaleLowerCase('tr-TR'))){setError('Bu isimde bir yemek zaten var.');return;}
   const food={id:modal.id||uid(),name:modal.name.trim(),baseGrams:number(modal.baseGrams),...Object.fromEntries(nutrients.map(k=>[k,number(modal[k])]))};
   createdItems=[{foodId:food.id,grams:String(food.baseGrams)}];
   update(d=>saveFood(d,food));
  }else{
   if(!modal.items.length||modal.items.some(i=>!validAmount(i.grams))){setError('En az bir yemek ekleyin ve her yemek için sıfırdan büyük gram miktarı girin.');return;}
   let items;try{items=snapshot(mergeItems(modal.items),nutrition.foods);}catch(e){setError(e.message);return;}
   if(modal.type==='meal'){
    if(!modal.name.trim()){setError('Öğün adı girin.');return;}
    const meal={id:modal.id||uid(),name:modal.name.trim(),items:mergeItems(modal.items).map(i=>({foodId:i.foodId,grams:number(i.grams)}))};
    createdItems=meal.items;createdMealId=meal.id;
    update(d=>({...d,meals:modal.id?d.meals.map(m=>m.id===modal.id?meal:m):[...d.meals,meal]}));
   }else update(d=>({...d,entries:[...d.entries,{id:uid(),date:modal.date,slot:modal.slot,items}]}));
  }
  if(modal.parent){
   const parent=modal.parent;
   // Keep invalid in-progress input intact; the new definition remains available in the library.
   try{setModal({...parent,items:mergeItems([...parent.items,...createdItems]),selectedMealIds:createdMealId?[...new Set([...(parent.selectedMealIds||[]),createdMealId])]:parent.selectedMealIds});setError('');}
   catch(e){setModal(parent);setError('Kayıt oluşturuldu. Eklemek için önce seçili yemeğin gram miktarını düzeltin.');}
  }else{
   if(modal.type==='log'&&modal.historical){chooseDate(modal.date);setTab('history');setExpanded(current=>({...current,[modal.slot]:true}));}
   setModal(null);
  }
 };
 const addItems=(items,mealId)=>{try{patch({items:mergeItems([...modal.items,...items]),selectedMealIds:mealId?[...new Set([...(modal.selectedMealIds||[]),mealId])]:modal.selectedMealIds});setError('');}catch(e){setError(e.message);}};
 const addFood=food=>addItems([{foodId:food.id,grams:String(food.baseGrams)}]);
 const deleteRecord=()=>{update(d=>modal.kind==='food'?removeFood(d,modal.id):modal.kind==='meal'?{...d,meals:d.meals.filter(m=>m.id!==modal.id)}:{...d,entries:d.entries.filter(e=>e.id!==modal.id)});setModal(null);};
 const visibleFoods=nutrition.foods.filter(f=>f.name.toLocaleLowerCase('tr-TR').includes(search.toLocaleLowerCase('tr-TR')));
 return <View style={{flex:1}}>
 <ScrollView key={tab} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
 <Text style={s.todayDate}>{dateLabel(new Date(today+'T12:00:00'))}</Text>
 <Text style={s.hero} numberOfLines={1} adjustsFontSizeToFit>{{today:'İyi beslen. İyi hisset.',meals:'Kayıtlı öğünler',foods:'Yemekler',history:'Beslenme geçmişi'}[tab]}</Text>
 {tab==='history'&&<View style={s.card}>
 <View style={[s.row,{gap:6}]}><View style={s.calendarActions}><DayArrow jump onPress={()=>{setDate(shiftDay(date,-7));setWeek(shiftDay(week,-7));}}/><DayArrow onPress={()=>chooseDate(shiftDay(date,-1))}/></View><Text numberOfLines={2} adjustsFontSizeToFit style={[s.todayDate,{flex:1,textAlign:'center'}]}>{dayLabel(date)}</Text><View style={s.calendarActions}><DayArrow forward disabled={date>=today} onPress={()=>chooseDate(shiftDay(date,1))}/><DayArrow forward jump disabled={date>=today} onPress={()=>chooseDate(today)}/></View></View>
 <View style={s.weekRow}>{Array.from({length:7},(_,i)=>shiftDay(week,i-6)).map(key=><Pressable accessibilityRole="button" accessibilityLabel={dayLabel(key)} accessibilityState={{selected:key===date}} onPress={()=>chooseDate(key)} key={key} style={[s.day,date===key&&s.selected]}><Text numberOfLines={1} adjustsFontSizeToFit style={s.weekday}>{new Date(key+'T12:00:00').toLocaleDateString('tr-TR',{weekday:'short'})}</Text><Text style={s.text}>{Number(key.slice(-2))}</Text><Text style={s.accent}>{nutrition.entries.some(e=>e.date===key)?'●':'·'}</Text></Pressable>)}</View>
 </View>}
 {(tab==='today'||tab==='history')&&<>

 {tab==='today'&&<View style={s.card}><Text style={s.label}>ÖĞÜN VAKTİ</Text><DropdownSelect options={slots.map(([id,name])=>({id,name}))} value={slot} onChange={setSlot} label="Bugünün öğününü seç" placeholder="Öğün seç" closeLabel="Öğün menüsünü kapat"/><Button title="Öğün kaydet" onPress={openLog}/></View>}
 <View style={s.summary}><Text style={s.title}>Günün toplamı</Text><Macros items={entries.flatMap(e=>e.items)}/></View>
 {slots.map(([id,label])=>{const records=entries.filter(e=>e.slot===id);const grouped=groupedConsumption(records);return <View key={id} style={s.card}><Pressable style={[s.row,s.mealToggle]} hitSlop={6} accessibilityRole="button" accessibilityLabel={label+' detaylarını '+(expanded[id]?'kapat':'aç')} accessibilityState={{expanded:!!expanded[id]}} onPress={()=>setExpanded(current=>({...current,[id]:!current[id]}))}><MealIcon id={id}/><Text style={[s.title,{flex:1}]}>{label}</Text><View accessible={false} style={s.chevronArea}><View style={[s.chevron,{transform:[{rotate:expanded[id]?'45deg':'225deg'}]}]}/></View></Pressable><Macros items={records.flatMap(e=>e.items)}/>{expanded[id]&&<>{!records.length&&<Text style={s.subtitle}>Bu öğünde henüz tüketim kaydı yok.</Text>}
 {grouped.map(item=><View key={item.food.id} style={s.record}><View style={s.row}><Text style={[s.text,{flex:1}]}>{item.food.name}</Text><Text style={s.muted}>{fmt(item.grams)} g</Text></View><Macros items={[item]}/></View>)}
 {!!grouped.length&&<Button secondary title="Düzenle" onPress={()=>open({type:'editConsumption',date:activeDate,slot:id,items:grouped.map(item=>({...item,grams:String(item.grams)}))})}/>}
 </>}</View>;})}
 </>}
 {tab==='foods'&&<><Text style={s.subtitle}>Besin değerlerini bir kez tanımla, her öğünde kullan.</Text><Button title="Yemek ekle" onPress={()=>openFood()}/><Field label="Yemek ara" value={search} onChangeText={setSearch}/>{!visibleFoods.length&&<Text style={s.subtitle}>{nutrition.foods.length?'Aramaya uygun yemek yok.':'Henüz yemek eklenmedi. İlk yemeğini ekle.'}</Text>}{visibleFoods.map(food=><View key={food.id} style={s.card}><View style={s.cardHeader}><Text style={[s.title,s.headerText]}>{food.name}</Text><RemoveButton label={food.name+' yemeğini sil'} onPress={()=>open({type:'delete',kind:'food',id:food.id})}/></View><Text style={s.muted}>{fmt(food.baseGrams)} g için</Text><Macros items={[{food,grams:food.baseGrams}]}/><Button secondary title="Düzenle" onPress={()=>openFood(food)}/></View>)}</>}
 {tab==='meals'&&<><Text style={s.subtitle}>Birlikte tükettiğin yemekleri gruplandır.</Text><Button title="Öğün oluştur" onPress={()=>openMeal()}/>{!nutrition.meals.length&&<Text style={s.subtitle}>Henüz kayıtlı öğün yok. Önce yemeklerini ekleyip bir öğünde birleştir.</Text>}{nutrition.meals.map(meal=><View key={meal.id} style={s.card}><View style={s.cardHeader}><Text style={[s.mealTitle,s.headerText]}>{meal.name}</Text><RemoveButton label={meal.name+' öğününü sil'} onPress={()=>open({type:'delete',kind:'meal',id:meal.id})}/></View>{meal.items.map((item,i)=><Text key={i} style={s.muted}>{nutrition.foods.find(f=>f.id===item.foodId)?.name} · {fmt(item.grams)} g</Text>)}{!meal.items.length?<Text style={s.subtitle}>Bu öğündeki yemekler silinmiş. Düzenleyerek yemek ekle.</Text>:<Macros items={snapshot(meal.items,nutrition.foods)}/>}<Button secondary title="Düzenle" onPress={()=>openMeal(meal)}/></View>)}</>}
 {tab==='history'&&<Button title="Geçmişe öğün kaydet" onPress={()=>open({type:'pastMeal',date,slot:null})}/>}
 </ScrollView>
 <TabBar tabs={tabs} selected={tab} onChange={setTab}/>
 <Modal visible={!!modal} animationType="slide" onRequestClose={closeModal}><SafeAreaView style={s.safe}><KeyboardAvoidingView style={s.shell} behavior={Platform.OS==='ios'?'padding':undefined}><DropdownHost style={{flex:1}}><View style={s.modalHeader}><Text style={s.sectionTitle}>{modal?.type==='food'?'Yemek tanımla':modal?.type==='meal'?'Öğün oluştur':modal?.type==='log'?'Öğün kaydet':modal?.type==='editConsumption'?'Öğünü düzenle':modal?.type==='pastMeal'?'Geçmişe öğün kaydet':'Kaydı sil'}</Text><Pressable accessibilityRole="button" accessibilityLabel="Formu kapat" onPress={closeModal} style={s.closeButton}><Text style={s.closeIcon}>×</Text></Pressable></View><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
 {modal?.type==='pastMeal'&&<>
 <Text style={s.subtitle}>Takvimden günü, ardından kaydetmek istediğin öğün vaktini seç.</Text>
 <Calendar value={modal.date} onChange={date=>patch({date})}/>
 <Text style={s.label}>ÖĞÜN VAKTİ</Text>
 <DropdownSelect options={slots.map(([id,name])=>({id,name}))} value={modal.slot} onChange={slot=>patch({slot})} label="Geçmiş öğün vaktini seç" placeholder="Öğün seç" closeLabel="Öğün menüsünü kapat"/>
 </>}
 {modal?.type==='editConsumption'&&<>
 <Text style={[s.todayDate,s.centered]}>{dateLabel(new Date(modal.date+'T12:00:00'))}</Text>
 <Text style={[s.hero,s.centered]}>{slots.find(x=>x[0]===modal.slot)?.[1]}</Text>
 <Text style={s.subtitle}>Her besinin toplam gramını düzenle. Kalori ve besin değerleri miktara göre güncellenir.</Text>
 {modal.items.map((item,index)=><View key={item.food.id} style={s.card}><View style={s.cardHeader}><Text style={[s.title,s.headerText]}>{item.food.name}</Text><RemoveButton label={item.food.name+' tüketimini kaldır'} onPress={()=>patch({items:modal.items.filter((_,i)=>i!==index)})}/></View><GramInput label="Toplam miktar (g)" value={item.grams} onChangeText={grams=>patch({items:modal.items.map((row,i)=>i===index?{...row,grams}:row)})}/></View>)}
 {!modal.items.length&&<Text style={s.subtitle}>Kaydettiğinde bu öğündeki tüm tüketimler kaldırılacak.</Text>}
 {modal.items.every(item=>validAmount(item.grams))&&<View style={s.summary}><Text style={s.title}>Öğün toplamı</Text><Macros items={modal.items}/></View>}
 </>}
 {modal?.type==='food'&&<><Field label="Yemek adı" value={modal.name} onChangeText={name=>patch({name})}/><GramInput label="Referans miktar (g)" value={modal.baseGrams} onChangeText={baseGrams=>patch({baseGrams})}/><Text style={s.subtitle}>Aşağıdaki değerleri bu gram miktarı için gir.</Text>{nutrients.map(key=><GramInput key={key} unit={key==='kcal'?'kcal':'g'} label={labels[key]+(key==='kcal'?' (kcal)':' (g)')} value={modal[key]} onChangeText={value=>patch({[key]:value})}/>)}</>}
 {(modal?.type==='meal'||modal?.type==='log')&&<>
 {modal.type==='meal'?<Field label="Öğün adı" value={modal.name} onChangeText={name=>patch({name})}/>:<>
 <Text style={[s.todayDate,s.centered]}>{dateLabel(new Date(modal.date+'T12:00:00'))}</Text>
 <Text style={[s.hero,s.centered]}>{slots.find(x=>x[0]===modal.slot)?.[1]}</Text>
 <View style={s.sourceTabs}>{[['meals','Kayıtlı öğünler'],['foods','Yemekler']].map(([id,label])=><Pressable key={id} accessibilityRole="tab" accessibilityState={{selected:modal.source===id}} onPress={()=>patch({source:id,query:''})} style={[s.sourceTab,modal.source===id&&s.sourceActive]}><Text style={[s.sourceText,modal.source===id&&s.sourceActiveText]}>{label}</Text></Pressable>)}</View>
 </>}
 {(modal.type==='meal'||modal.source==='foods')?<>
 {modal.type!=='meal'&&<Button title="Yemek ekle" onPress={()=>openFood(null,modal)}/>}
 <Field label="Yemek ara" value={modal.query} onChangeText={query=>patch({query})}/>
 {!nutrition.foods.length&&<Text style={s.subtitle}>Henüz yemek yok. Yemek ekle düğmesiyle oluşturabilirsin.</Text>}
 {nutrition.foods.filter(f=>!modal.items.some(item=>item.foodId===f.id)&&f.name.toLocaleLowerCase('tr-TR').includes(modal.query.toLocaleLowerCase('tr-TR'))).map(food=><Button secondary key={food.id} title={food.name} onPress={()=>addFood(food)}/>)}
 {modal.type==='meal'&&<Button title="Yemek ekle" onPress={()=>openFood(null,modal)}/>}
 </>:<>
 <Button title="Öğün oluştur" onPress={()=>openMeal(null,modal)}/>
 <Field label="Kayıtlı öğün ara" value={modal.query} onChangeText={query=>patch({query})}/>
 {!nutrition.meals.some(m=>m.items.length)&&<Text style={s.subtitle}>Henüz yemek içeren kayıtlı öğün yok. Öğün oluşturabilir veya Yemekler sekmesinden seçim yapabilirsin.</Text>}
 {nutrition.meals.filter(m=>m.items.length&&!((modal.selectedMealIds||[]).includes(m.id)&&m.items.every(i=>modal.items.some(item=>item.foodId===i.foodId)))&&m.name.toLocaleLowerCase('tr-TR').includes(modal.query.toLocaleLowerCase('tr-TR'))).map(meal=><Button secondary key={meal.id} title={meal.name} onPress={()=>addItems(meal.items,meal.id)}/>)}
 </>}

 <Text style={s.title}>Seçilen yemekler</Text>{!modal.items.length&&<Text style={s.subtitle}>Henüz yemek seçmedin.</Text>}
 {modal.items.map((item,index)=><View key={index} style={s.card}><View style={s.cardHeader}><Text style={[s.title,s.headerText]}>{nutrition.foods.find(f=>f.id===item.foodId)?.name}</Text><RemoveButton label={(nutrition.foods.find(f=>f.id===item.foodId)?.name||'Yemek')+' seçimini çıkar'} onPress={()=>patch({items:modal.items.filter((_,i)=>i!==index)})}/></View><GramInput label="Miktar (g)" value={item.grams} onChangeText={grams=>patch({items:modal.items.map((x,i)=>i===index?{...x,grams}:x)})}/></View>)}
 {!!modal.items.length&&modal.items.every(i=>validAmount(i.grams))&&<View style={s.summary}><Text style={s.title}>Öğün toplamı</Text><Macros items={snapshot(modal.items,nutrition.foods)}/></View>}

 </>}
 {modal?.type==='delete'?<><Text style={s.subtitle}>{modal.kind==='food'?'Bu yemek ve kayıtlı öğünlerdeki bağlantıları silinecek. Tüketim geçmişin korunur.':modal.kind==='meal'?'Kayıtlı öğün silinecek. Yemeklerin ve tüketim geçmişin korunur.':'Bu tüketim kaydı silinecek ve günün toplamından çıkarılacak.'}</Text><Button title="Sil" onPress={deleteRecord}/></>:<Button title={modal?.type==='pastMeal'?'Öğün girişine devam et':modal?.type==='log'?'Öğünü kaydet':'Kaydet'} onPress={save}/>}
 </ScrollView>
 {!!error&&<View style={s.errorToast}><Text accessibilityRole="alert" accessibilityLiveRegion="assertive" style={s.errorToastText}>{error}</Text><Pressable accessibilityRole="button" accessibilityLabel="Uyarıyı kapat" onPress={()=>setError('')} style={s.toastClose}><Text style={s.toastCloseText}>×</Text></Pressable></View>}
 </DropdownHost></KeyboardAvoidingView></SafeAreaView></Modal>
 </View>;
}
const s=StyleSheet.create({
 calendarActions:{flexDirection:'row',gap:4},
 arrowIcons:{flexDirection:'row',alignItems:'center',gap:0},
 errorToast:{position:'absolute',top:12,left:16,right:16,zIndex:30,elevation:30,flexDirection:'row',alignItems:'center',gap:10,padding:14,backgroundColor:'#d5fa68',borderRadius:14,shadowColor:'#000',shadowOpacity:.25,shadowRadius:12,shadowOffset:{width:0,height:4}},
 errorToastText:{flex:1,color:'#17200e',fontSize:14,lineHeight:21,fontWeight:'600'},
 toastClose:{width:36,height:36,alignItems:'center',justifyContent:'center'},
 toastCloseText:{color:'#17200e',fontSize:28,lineHeight:32},
 centered:{textAlign:'center'},
 sourceTabs:{flexDirection:'row',gap:10},
 sourceTab:{flex:1,minWidth:0,minHeight:52,padding:12,borderRadius:12,borderWidth:1,borderColor:'#36422f',backgroundColor:'#1d241a',alignItems:'center',justifyContent:'center'},
 sourceActive:{backgroundColor:'#d5fa68',borderColor:'#d5fa68'},
 sourceText:{color:'#b3bcae',fontSize:14,fontWeight:'600',textAlign:'center'},
 sourceActiveText:{color:'#17200e'},
 weekRow:{flexDirection:'row',gap:4},
 weekday:{color:'#a2ae98',fontSize:12,lineHeight:19,textAlign:'center',width:'100%'},
 dayArrow:{width:36,height:48,borderRadius:12,backgroundColor:'#2a3425',alignItems:'center',justifyContent:'center'},
 cardHeader:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',gap:12},
 headerText:{flex:1,minWidth:0},
 removeButton:{width:40,height:40,flexShrink:0,borderRadius:10,borderWidth:1,borderColor:'#5b3933',backgroundColor:'#34221f',alignItems:'center',justifyContent:'center'},
 removeIcon:{fontSize:28,lineHeight:32,color:'#ed9b91',includeFontPadding:false,textAlign:'center'},
 mealToggle:{minHeight:56},
 chevronArea:{width:48,height:48,alignItems:'center',justifyContent:'center'},
 chevron:{width:12,height:12,borderTopWidth:2,borderLeftWidth:2,borderColor:'#d5fa68'},
 closeButton:{width:48,height:48,borderRadius:12,backgroundColor:'#2a3425',alignItems:'center',justifyContent:'center'},
 closeIcon:{color:'#f4f5ee',fontSize:40,lineHeight:44,textAlign:'center',includeFontPadding:false},
 todayDate:{color:'#a1ac94',fontSize:14,lineHeight:21,fontWeight:'600'},
 label:{color:'#93a185',fontSize:10,fontWeight:'600',letterSpacing:1},
 subtitle:{color:'#98a18f',fontSize:14,lineHeight:23},
 sectionTitle:{fontSize:19,fontWeight:'700',color:'#f4f5ee'},
 mealTitle:{color:'#f4f5ee',fontSize:24,fontWeight:'600',letterSpacing:-.6,lineHeight:31},
safe:{flex:1,backgroundColor:'#111411'},shell:{flex:1,width:'100%',maxWidth:640,alignSelf:'center'},content:{padding:24,gap:20,paddingBottom:32},hero:{fontSize:38,lineHeight:44,fontWeight:'800',color:'#f5f5ee',letterSpacing:-1.6},text:{color:'#e8efdf',fontSize:14,lineHeight:21},title:{color:'#f4f5ee',fontSize:17,fontWeight:'600',lineHeight:25},muted:{color:'#a2ae98',fontSize:12,lineHeight:19},accent:{color:'#d5fa68',fontWeight:'600',fontSize:13},unit:{fontSize:10,color:'#a2ae98'},row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,minHeight:44},card:{backgroundColor:'#1a2119',borderWidth:1,borderColor:'#303b29',borderRadius:18,padding:18,gap:16},summary:{backgroundColor:'#26331e',borderRadius:18,padding:18,gap:18},macros:{flexDirection:'row',gap:6},button:{minHeight:48,padding:14,borderRadius:12,backgroundColor:'#d5fa68',alignItems:'center',justifyContent:'center'},secondary:{backgroundColor:'#2a3425'},buttonText:{color:'#18230f',fontSize:14,fontWeight:'700'},input:{backgroundColor:'#1d241a',borderWidth:1,borderColor:'#43523a',borderRadius:12,padding:14,color:'#f5f5ee',fontSize:16,minHeight:48},record:{borderTopWidth:1,borderColor:'#36422f',paddingTop:16,gap:20},selected:{backgroundColor:'#303e25'},day:{flex:1,minWidth:0,paddingVertical:10,alignItems:'center',gap:5,borderRadius:14,backgroundColor:'#20291b'},modalHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:16,borderBottomWidth:1,borderColor:'#303b29'},error:{color:'#ffb8a1',padding:14,backgroundColor:'#3d2019',borderRadius:12}});
