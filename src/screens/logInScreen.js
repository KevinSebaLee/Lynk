import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ImageBackground, TouchableOpacity, Platform, StyleSheet, Text, TextInput, View, Button, Image, KeyboardAvoidingView, Pressable, } from 'react-native';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import signUpScreen from './signUpScreen';
import inicioScreen from './incioScreen';

export default function logInScreen() {
  
  const [mail, onChangeText] = React.useState('');
  const [psw, onChangeNumber] = React.useState('');
  const loginPic = require('../../assets/images/login.png');
  const bgLogin = require('../../assets/images/bgLogin.png');
  const arrow = {uri: 'https://cdn-icons-png.flaticon.com/512/154/154630.png'};
  const navigation = useNavigation();


  return (
    <View style={{flex: 1}}>
    <ImageBackground source={bgLogin} resizeMode="cover" style={{flex: 1, justifyContent: 'center'}}>
    <View style={styles.header}> 

    <TouchableOpacity onPress={() => navigation.navigate(inicioScreen)}>
      <Image style={styles.arrow} source={arrow} />
    </TouchableOpacity>      
    <Text style={styles.headerText}> Bienvenido de vuelta</Text>

    </View>

    <View style={styles.picView}>
      <Image 
          style={styles.logPic}
          source={loginPic}
        />

    </View>

      <View style={{flex: 4}}>  
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TextInput 
            style = {styles.input}
            onChangeText={onChangeText}
            value={mail}
            placeholder="Ingrese su email"/>

          <TextInput 
            style = {styles.input}
            onChangeText={onChangeNumber}
            value={psw}
            placeholder="Ingrese su contraseña"
            secureTextEntry/>

          <StatusBar style='dark'/>
        
        <TouchableOpacity style={styles.btnView}>
          <Text style={{textAlign:'center', color:'#ffffff'}}>Ingresar</Text>
        </TouchableOpacity>
        </KeyboardAvoidingView>
        
        <HideWithKeyboard style={styles.bottomSection}>
          <Text style={{fontSize:15,}}>No tienes cuenta?  <Pressable onPress={() => navigation.navigate(signUpScreen)}><Text style={{color: '#642684', fontSize:15, textDecorationLine: 'underline'}}>Crear cuenta</Text></Pressable>
          </Text>
          <View style={styles.redes}>
            <Text style={{fontSize: 15, textAlign: 'center', marginBottom:10,}}>O continua con </Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
              <Image style={{width: 30, height: 30}} source={{uri: 'https://cdn.iconscout.com/icon/free/png-512/free-google-logo-icon-download-in-svg-png-gif-file-formats--brands-pack-logos-icons-189824.png?f=webp&w=256'}}/>
              <Image style={{width: 48, height: 48}} source={{uri: 'https://static.vecteezy.com/system/resources/previews/042/148/632/non_2x/instagram-logo-instagram-social-media-icon-free-png.png'}}/>  
              <Image style={{width: 30, height: 30}} source={{uri: 'https://cdn.pixabay.com/photo/2021/06/15/12/51/facebook-6338508_1280.png'}}/>
            </View>
          </View>
        </HideWithKeyboard>
      </View>  
    </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  header:{
    flex: 1,
    marginTop: 60,
    marginLeft: 20,
    flexDirection: 'row'
  },

  redes:{
    width: 300,
    height: 150,
    marginTop:15,
  },

  arrow:{
    resizeMode: 'contain',
    marginTop:10,
    width: 25,
    height: 25,
    marginRight: 10,
    marginLeft:15,
  },

  logPic:{
    resizeMode: 'contain',
    flex:7,
    justifyContent: 'center',
    marginRight:10
  },

  picView:{
    flex:3, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    marginTop: 40,
  },

  headerText:{
    fontSize: 22,
    marginTop:5,
  },

  btnView:{
    display:'flex',
    justifyContent: 'center',
    alignContent: 'center',
    width:300,
    borderRadius: 5, 
    marginBottom:45,
    backgroundColor:'#642684',
    height: 45,
   },

  container: {
    flex: 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  input: {
    height: 45,
    width:300,
    margin: 12,
    borderWidth: 1,
    borderRadius:5,
    padding: 10,
    borderColor: '#642684',
    backgroundColor: 'white',
  },
  bottomSection: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },
});