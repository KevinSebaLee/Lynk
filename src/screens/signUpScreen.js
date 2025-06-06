import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ImageBackground, TouchableOpacity, Platform, StyleSheet, Text, TextInput, View, Button, Image, KeyboardAvoidingView, Pressable, } from 'react-native';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import logInScreen from './logInScreen';
import inicioScreen from './incioScreen';

export default function signUpScreen() {
  
  const [mail, onChangeText] = React.useState('');
  const [psw, onChangeNumber] = React.useState('');
  const signPic = require('../../assets/images/signPic.png');
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
    <Text style={styles.headerText}> Bienvenido a Lynk</Text>

    </View>

    <View style={styles.picView}>
      <Image 
          style={styles.signPic}
          source={signPic}
        />

    </View>

      <View style={{flex: 4}}>  
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TextInput 
            style = {styles.input}
            onChangeText={onChangeText}
            value={mail}
            placeholder="Ingrese su nombre"/>

          <TextInput 
            style = {styles.input}
            onChangeText={onChangeNumber}
            value={psw}
            placeholder="Ingrese su apellido"
            secureTextEntry/>

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

          <TextInput 
            style = {styles.input}
            onChangeText={onChangeNumber}
            value={psw}
            placeholder="Confirmar contraseña"
            secureTextEntry/>

        <StatusBar style='dark'/>
        
        <TouchableOpacity style={styles.btnView}>
          <Text style={{textAlign:'center', color:'#ffffff'}}>Ingresar</Text>
        </TouchableOpacity>
        </KeyboardAvoidingView>
        
        <HideWithKeyboard style={styles.bottomSection}>
          <Text style={{fontSize:15,}}>Ya tienes cuenta?  <Pressable style={{display:'flex', alignItems:'center', justifyContent:'center'}} onPress={() => navigation.navigate(logInScreen)}><Text style={{color: '#642684', fontSize:15, textDecorationLine: 'underline', paddingTop:3}} >Log in</Text></Pressable>
          </Text>

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
  
  signPic:{
    resizeMode:'cover',
    width:250,
    height:250,
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


  picView:{
    flex:1, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:60,
    marginTop: 5,
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