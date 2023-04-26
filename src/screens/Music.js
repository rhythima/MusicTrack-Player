import { View, Text ,StyleSheet,Image,TouchableOpacity,FlatList, Dimensions} from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { useRoute } from '@react-navigation/native'
import { songs } from '../MusicData';
const {height,width}=Dimensions.get('window')
import {Slider} from '@rneui/themed'
import TrackPlayer,{Capability,usePlaybackState,useProgress,State} from 'react-native-track-player'

const Music = () => {
  const route=useRoute();
  const progress=useProgress()
  const[currentSong,setCurrentSong]=useState(route.params.index)
  const ref=useRef()

  const playbackState=usePlaybackState()

  useEffect(()=>{
    setTimeout(()=>{
      ref.current.scrollToIndex({
        animated:true,
        index:currentSong,
      })
    },500)
  },[])


  useEffect(()=>{
    setupPlayer()
  },[])

  const setupPlayer=async()=>{
    try{
      await TrackPlayer.setupPlayer()
      await TrackPlayer.updateOptions({
        // Media controls capabilities
        capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
        ],
    
        // Capabilities that will show up when the notification is in the compact form on Android
        compactCapabilities: [Capability.Play, Capability.Pause],
    });
    await TrackPlayer.add(songs)

    }catch(e){}
   
  }

  const togglePlayback=async playbackState=>{
    console.log(playbackState)
    if(playbackState===State.Paused || playbackState===State.Ready || playbackState===State.Buffering || playbackState===State.Connecting){
      await TrackPlayer.play()
    }else{
      await TrackPlayer.pause()
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          horizontal
          ref={ref}
          showsHorizontalScrollIndicator={false}
          paddingEnabled
          data={songs}
          onScroll={async e=>{
            const x=e.nativeEvent.contentOffset.x/width
            setCurrentSong(parseInt(x.toFixed(0)))
            await TrackPlayer.skip(parseInt(x.toFixed(0)))
            togglePlayback(playbackState)
          }}
          renderItem={({item,index})=>{
            return (
            <View style={styles.bannerView}>
            <Image source={item.artwork} style={styles.banner}/>
            <Text style={styles.name}>{item.title}</Text>
            <Text style={styles.name}>{item.artist}</Text>
            </View>
          )}}
        />
      </View>
    <View style={styles.sliderView}>
   <Slider
    value={progress.position}
    maximumValue={progress.duration}
    minimumValue={0}
    thumbStyle={{width:20,height:20}}
    thumbTintColor={'black'}
    onValueChange={async value=>{
      await TrackPlayer.seekTo(value)
    }}
   />
    </View>
    <View style={styles.btnArea}>
      <TouchableOpacity
      onPress={async()=>{
        if(currentSong>0){
          setCurrentSong(currentSong-1)
          ref.current.scrollToIndex({
            animated:true,
            index:parseInt(currentSong)-1
          }) 
          await TrackPlayer.skip(parseInt(currentSong-1))
          togglePlayback(playbackState)
        }      
      }}>
        <Image
          source={require('../images/previous.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity
       onPress={async()=>{
            // await TrackPlayer.skip(1)
            togglePlayback(playbackState)
        }}
        >
        <Image
          source={playbackState==State.Paused || playbackState==State.Ready ?  require('../images/play.png'):require('../images/pause.png')}
          style={[styles.icon,{width:60,height:60}]}
        />
      </TouchableOpacity>
      <TouchableOpacity 
      onPress={async()=>{
        if(songs.length-1>currentSong){
          setCurrentSong(currentSong+1)
          ref.current.scrollToIndex({
            animated:true,
            index:parseInt(currentSong)+1
          })
          await TrackPlayer.skip(parseInt(currentSong+1))
          togglePlayback(playbackState)
        }
      }}>
        <Image 
          source={require('../images/next.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
    <View style={styles.btnArea}>
      <TouchableOpacity>
        <Image
          source={require('../images/shuffle.png')}
          style={[styles.icon,{height:43}]}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image 
          source={require('../images/repeat.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
    </View>
  )
}

export default Music

const styles=StyleSheet.create({
container:{
  flex:1
},
banner:{
  width:'90%',
  height:'100%',
  borderRadius:10
},
bannerView:{ 
width:width,
height:height/2-50,
justifyContent:'center',
alignItems:'center',
marginTop:60,
borderRadius:10
},
name:{
  marginTop:10,
  fontSize:20,
  marginLeft:20,
  fontWeight:'700',
  color:'black'
},
sliderView:{
  marginTop:20,
  alignSelf:'center',
  width:'90%'
},
btnArea:{
  flexDirection:'row',
  width:'100%',
  justifyContent:'space-evenly',
  alignItems:'center',
  marginTop:15
},
icon:{
  width:35,
  height:35
}
})