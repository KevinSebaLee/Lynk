import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthButton } from '../components';

export default function InicioScreen() {
  const navigation = useNavigation();
  const picInicio = require('../../assets/img/picInicio.png');

  return (
    <SafeAreaView style={styles.container}>
      <Image source={picInicio} resizeMode="cover" style={styles.img}/>
      <View style={{flex:8, marginBottom:60}}>
        <Text style={{fontWeight:'bold', fontSize: 28, textAlign:'center'}}>Descubre eventos </Text>
        <Text style={{fontWeight:'bold', fontSize: 28, textAlign:'center', marginBottom: 15}}>que conectan tu pasión</Text>
        <Text style={{fontSize: 15, textAlign:'center', marginHorizontal:30}}>Participa de eventos relevantes para </Text>
        <Text style={{fontSize: 15, textAlign:'center', marginHorizontal:30}}>vos, de forma simple y organizada</Text>
      </View>
      <View style={styles.botones}>
        <AuthButton 
          title="Log in"
          onPress={() => navigation.navigate('logInScreen')}
          variant="primary"
          style={styles.botonVio}
        />
        <AuthButton 
          title="Sign Up" 
          onPress={() => navigation.navigate('signUpScreen')}
          variant="secondary"
          style={styles.botonLight}
        />
      </View>
      <StatusBar  style='dark'/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  img:{ width:350, height:250, resizeMode:'contain', flex:16, marginBottom:85, marginTop:220 },
  botones:{ width: 280, height: 40, flexDirection:'row', justifyContent: 'space-between', flex:7 },
  botonVio:{ backgroundColor: '#642684', width:120, height:40, color: 'white', borderRadius:5, textAlign:'center', paddingTop:9, shadowColor: '#000', shadowOffset: {width: 0, height: 9}, shadowOpacity: 0.50, shadowRadius: 12.35, elevation: 19 },
  botonLight:{ backgroundColor: '#fff', width:120, height:40, borderRadius:5, textAlign:'center', paddingTop:9, shadowColor: '#000', shadowOffset: {width: 0, height: 9}, shadowOpacity: 0.50, shadowRadius: 12.35, elevation: 19 },
});