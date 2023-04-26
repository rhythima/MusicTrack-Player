import { View, Text, Dimensions, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
const { height, width } = Dimensions.get('window')

const MusicList = ({ item, index, data }) => {
    const navigation=useNavigation()
    return (
        <TouchableOpacity style={[styles.conatiner, 
        {marginBottom: index == data.length - 1 ? 30 : 0 },]}
       onPress={()=>{
        navigation.navigate('Music',{
            data:item,
            index:index,
        })
       }}
        >
        <Image source={item.artwork} style={styles.songImage}/>
        <View style={styles.nameView}>
            <Text style={styles.name}>{item.title}</Text>
            <Text style={styles.name}>{item.singer}</Text>
        </View>
        <TouchableOpacity 
        onPress={()=>{
        navigation.navigate('Music',{
            data:item,
            index:index,
        })
       }}>
            <Image source={require('../images/play.png')} style={styles.play}/>
        </TouchableOpacity>
        </TouchableOpacity>
    )
}

export default MusicList

const styles = StyleSheet.create({
    conatiner: {
        width: width - 20,
        height: 100,
        elevation: 5,
        marginTop: 20,
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        flexDirection:'row',
        alignItems:'center'
    },
    songImage:{
        width:100,
        height:90,
        borderRadius:10,
        marginLeft:7
    },
    nameView:{
        paddingLeft:15,
        width:'60%'
    },
    name:{
        fontSize:20,
        fontWeight:'500',
        color:'black'
    },
    play:{
        width:30,
        height:30
    }
})