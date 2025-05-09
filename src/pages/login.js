import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Image } from 'react-native';

export default function App() {
  
  const [mail, onChangeText] = React.useState('');
  const [psw, onChangeNumber] = React.useState('');
  const loginPic = require('./assets/images/login.png');
  const arrow = {uri: 'https://cdn-icons-png.flaticon.com/512/154/154630.png'};

  return (
    <View style={{flex: 1}}>
    <View style={styles.header}> 
      <Image style= {styles.arrow} source={arrow}/>
      <Text style={styles.headerText}> Bienvenido de vuelta</Text>
    </View>
    <View style={styles.picView}>
      <Image 
          style={styles.logPic}
          source={loginPic}
        />
    </View>
      <View style={{flex: 4}}>  
        <View style={styles.container}>
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
            secureTextEntry
            />
          <StatusBar style={styles.status} />
        </View>
        <View style={styles.btnView}>
          <Button style={styles.btn}
            title="Ingresar"
            color="#642684"/>
        </View>
        <View style={styles.bottomSection}>
          <Text style={{fontSize:15,}}>Olvidaste la clave?</Text>
          <Text style={{color: '#642684', fontSize:15, textDecorationLine: 'underline'}} >Crear cuenta</Text>
        </View>
      </View>  
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

  arrow:{
    resizeMode: 'contain',
    marginTop: 5,
    width: 25,
    height: 25,
    marginRight: 10,
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
  },

  btnView:{
    flex: 1,
    marginStart: 55,
    justifyContent: 'center',
    alignContent: 'center',
    width:300,
  },

  btn:{
    width:100,
    borderRadius: 5,
  },

  status:{
    backgroundColor:'#642684',
  },

  container: {
    flex: 2,
    backgroundColor: '#fff',
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
  },
  bottomSection: {
    flex: 2, 
    alignItems: 'center',
    justifyContent: 'center',
  },
});