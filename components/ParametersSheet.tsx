import React, { useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, LayoutChangeEvent
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props { visible: boolean; onClose: () => void; }

const LANGUAGES = ['ქართული','ფრანგული','იაპონური','ინგლისური','არაბული','ნიდერლანდური','გერმანული','შვედური','ესპანური','იტალიური','თურქული','პოლონური','პორტუგალიური','ჩინური','კორეული','ჰინდი','უკრაინული','რუმინული','უნგრული','რუსული'];
const SPEAKER_OPTIONS = ['მოსაუბრის გამოყოფა','მოსაუბრის არ გამოყოფა'];
const STT_OPTIONS = ['STT1','STT2','STT3'];
const MIC_OPTIONS = ['მიკროფონი','სისტემის ხმა'];
type ActivePicker = 'speaker' | 'stt' | 'mic' | null;

const BLUE = '#4A90E2';

const PopupMenu = ({ visible, options, selected, onSelect, onClose, anchorLayout }: { visible: boolean; options: string[]; selected: string; onSelect: (v: string)=>void; onClose: ()=>void; anchorLayout: { x:number;y:number;width:number;height:number } | null }) => {
  if(!visible || !anchorLayout) return null;
  const { x, y, width, height } = anchorLayout;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.popupOverlay} activeOpacity={1} onPress={onClose}/>
      <View style={[styles.popupMenu, { left: x, top: y + height + 5, width }]}>
        {options.map(o=>(
          <TouchableOpacity key={o} style={styles.popupRow} onPress={()=>{onSelect(o); onClose();}}>
            <Text style={[styles.popupText, o===selected && styles.popupTextActive]}>{o}</Text>
            {o===selected && <Ionicons name="checkmark" size={16} color={BLUE} />}
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
};

const DropdownRow = ({ label, onPress, onLayout, isActive }: { label:string; onPress:()=>void; onLayout?: (e:LayoutChangeEvent)=>void; isActive?:boolean }) => (
  <TouchableOpacity style={[styles.dropdown, isActive && styles.dropdownActive]} onPress={onPress} onLayout={onLayout}>
    <Text style={styles.dropdownLabel}>{label}</Text>
    <Ionicons name="chevron-down" size={18} color="#555"/>
  </TouchableOpacity>
);

export default function ParametersSheet({ visible, onClose }: Props) {
  const [punctuation,setPunctuation]=useState(true);
  const [autoCorrect,setAutoCorrect]=useState(false);
  const [language,setLanguage]=useState('ქართული');
  const [speaker,setSpeaker]=useState('მოსაუბრის გამოყოფა');
  const [stt,setStt]=useState('STT1');
  const [mic,setMic]=useState('მიკროფონი');
  const [langOpen,setLangOpen]=useState(false);
  const [langQuery,setLangQuery]=useState('');
  const [activePicker,setActivePicker]=useState<ActivePicker>(null);
  const [layouts,setLayouts]=useState<{[key:string]:{x:number;y:number;width:number;height:number}|null}>({speaker:null,stt:null,mic:null});

  const filtered = LANGUAGES.filter(l=>l.toLowerCase().includes(langQuery.toLowerCase()));
  const togglePicker = (key: ActivePicker)=> setActivePicker(activePicker===key?null:key);

  const onLayout = (key: string) => (e: any) => {
    e.target.measure((x,y,width,height,pageX,pageY)=>setLayouts(prev=>({...prev,[key]:{x:pageX,y:pageY,width,height}})));
  };

  return <>
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}/>
      <View style={styles.sheet}>
        <TouchableOpacity style={[styles.dropdown, langOpen && styles.dropdownActive]} onPress={()=>setLangOpen(!langOpen)}>
          <Text style={styles.dropdownLabel}>{language}</Text>
          <Ionicons name={langOpen?'chevron-up':'chevron-down'} size={18} color={langOpen?BLUE:'#555'}/>
        </TouchableOpacity>

        {langOpen ? (
          <View style={styles.langBox}>
            <View style={styles.searchRow}>
              <Ionicons name="search-outline" size={15} color="#aaa" style={{marginRight:6}}/>
              <TextInput style={styles.searchInput} placeholder="ძიება" placeholderTextColor="#bbb" value={langQuery} onChangeText={setLangQuery} autoFocus/>
              {langQuery.length>0 && <TouchableOpacity onPress={()=>setLangQuery('')}><Ionicons name="close-circle" size={15} color="#bbb"/></TouchableOpacity>}
            </View>
            <FlatList data={filtered} keyExtractor={i=>i} style={styles.langList} keyboardShouldPersistTaps="handled" renderItem={({item})=>(
              <TouchableOpacity style={styles.langRow} onPress={()=>{setLanguage(item); setLangOpen(false); setLangQuery('')}}>
                <Text style={[styles.langText,item===language && styles.langActive]}>{item}</Text>
                {item===language && <Ionicons name="checkmark" size={16} color={BLUE}/>}
              </TouchableOpacity>
            )}/>
          </View>
        ) : <>
          <DropdownRow label={speaker} onPress={()=>togglePicker('speaker')} onLayout={onLayout('speaker')} isActive={activePicker==='speaker'}/>
          <DropdownRow label={stt} onPress={()=>togglePicker('stt')} onLayout={onLayout('stt')} isActive={activePicker==='stt'}/>
          <DropdownRow label={mic} onPress={()=>togglePicker('mic')} onLayout={onLayout('mic')} isActive={activePicker==='mic'}/>

          <View style={styles.toggleRow}>
            <TouchableOpacity style={styles.toggleItem} onPress={()=>setPunctuation(v=>!v)}>
              <View style={[styles.circle,punctuation && styles.circleOn]}>{punctuation && <Ionicons name="checkmark" size={13} color="#fff"/>}</View>
              <Text style={styles.toggleLabel}>პუნქტუაცია</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toggleItem} onPress={()=>setAutoCorrect(v=>!v)}>
              <View style={[styles.circle,autoCorrect && styles.circleOn]}>{autoCorrect && <Ionicons name="checkmark" size={13} color="#fff"/>}</View>
              <Text style={styles.toggleLabel}>ავტოკორექცია</Text>
            </TouchableOpacity>
          </View>
        </>}

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}><Text style={styles.cancelText}>გაუქმება</Text></TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={onClose}><Text style={styles.saveText}>დამახსოვრება</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>

    <PopupMenu visible={activePicker==='speaker'} options={SPEAKER_OPTIONS} selected={speaker} onSelect={setSpeaker} onClose={()=>setActivePicker(null)} anchorLayout={layouts.speaker}/>
    <PopupMenu visible={activePicker==='stt'} options={STT_OPTIONS} selected={stt} onSelect={setStt} onClose={()=>setActivePicker(null)} anchorLayout={layouts.stt}/>
    <PopupMenu visible={activePicker==='mic'} options={MIC_OPTIONS} selected={mic} onSelect={setMic} onClose={()=>setActivePicker(null)} anchorLayout={layouts.mic}/>
  </>;
}

const styles = StyleSheet.create({
  overlay:{flex:1,backgroundColor:'rgba(0,0,0,0.35)'},
  sheet:{position:'absolute',bottom:0,left:0,right:0,backgroundColor:'#fff',borderTopLeftRadius:20,borderTopRightRadius:20,padding:20,paddingBottom:32},
  dropdown:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderWidth:1,borderColor:'#e0e0e0',borderRadius:8,paddingHorizontal:14,paddingVertical:12,marginBottom:10,backgroundColor:'#fafafa'},
  dropdownActive:{borderColor:BLUE,backgroundColor:'#f0f6ff'},
  dropdownLabel:{fontSize:14,color:'#333'},
  langBox:{borderWidth:1,borderTopWidth:0,borderColor:BLUE,borderBottomLeftRadius:8,borderBottomRightRadius:8,marginBottom:10,overflow:'hidden'},
  searchRow:{flexDirection:'row',alignItems:'center',paddingHorizontal:12,paddingVertical:8,borderBottomWidth:1,borderBottomColor:'#eee',backgroundColor:'#fafafa'},
  searchInput:{flex:1,fontSize:14,color:'#333',padding:0},
  langList:{maxHeight:200},
  langRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:14,paddingVertical:11,borderBottomWidth:1,borderBottomColor:'#f5f5f5'},
  langText:{fontSize:14,color:'#333'},
  langActive:{color:BLUE,fontWeight:'600'},
  toggleRow:{flexDirection:'row',gap:24,marginVertical:14},
  toggleItem:{flexDirection:'row',alignItems:'center',gap:8},
  circle:{width:22,height:22,borderRadius:11,borderWidth:2,borderColor:'#ddd',justifyContent:'center',alignItems:'center'},
  circleOn:{backgroundColor:BLUE,borderColor:BLUE},
  toggleLabel:{fontSize:14,color:'#333'},
  buttons:{flexDirection:'row',gap:12,marginTop:4},
  cancelBtn:{flex:1,paddingVertical:13,borderRadius:10,alignItems:'center',borderWidth:1,borderColor:'#e0e0e0'},
  cancelText:{color:'#555',fontWeight:'500',fontSize:15},
  saveBtn:{flex:1,paddingVertical:13,borderRadius:10,alignItems:'center',backgroundColor:BLUE},
  saveText:{color:'#fff',fontWeight:'600',fontSize:15},
  popupOverlay:{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.1)'},
  popupMenu:{position:'absolute',backgroundColor:'#fff',borderRadius:8,borderWidth:1,borderColor:'#e0e0e0',shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:4,elevation:5,zIndex:1000},
  popupRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:14,paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#f5f5f5'},
  popupText:{fontSize:14,color:'#333'},
  popupTextActive:{color:BLUE,fontWeight:'600'},
});