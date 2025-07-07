import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image , Dimensions, Button, Pressable, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import Header from '../components/header.js';
import Container from '../components/container.js';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TicketCard from "../components/TicketCard.js";
import GradientBarChart from '../components/GradientBarChart.js';
import home from './home.js';




//import Carousel from 'react-native-snap-carousel';


const width = Dimensions.get('window').width;
const arrow = { uri: 'https://cdn-icons-png.flaticon.com/512/154/154630.png' };




export default function tickets() {
 
  // const carouselItems = [
  //   { title: 'Promo 1', text: '50% en tu primera compra' , bgImage: require('./assets/img/lollapalooza.jpg')},
  //   { title: 'Promo 2', text: '2x1 en recargas los lunes' },
  //   { title: 'Promo 3', text: 'Plan premium gratis 7 días' },
  // ];
 
  const navigation = useNavigation();
  return (
    <>
    <SafeAreaView>
    <ScrollView>
    <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image style={styles.arrow} source={arrow} />
            </TouchableOpacity>
            <Text style={styles.headerText}> Tus tickets</Text>
          </View>
    <Pressable style={{marginTop: 10}}>
            <View style={styles.ticketWrapper}>
              <TicketCard
                onGetMore={() => alert("¡Función para conseguir más tickets!")}
              />
            </View>
    </Pressable>


    <View style={styles.listMov}>
      <Text style={styles.trans}>Transacciones</Text>
    <View style={styles.container}>
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name="home" size={24} color="#7b4ef7" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.title}>Ariana grande</Text>
      <Text style={styles.subtitle}>Concierto en obras</Text>
    </View>
    <View style={styles.rightContainer}>
      <Text style={styles.amount}>-53.95</Text>
      <Text style={styles.date}>Julio 14, 2022</Text>
    </View>
  </View>
  <View style={styles.container}>
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name="home" size={24} color="#7b4ef7" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.title}>Garden Party</Text>
      <Text style={styles.subtitle}>Jardín Botánico</Text>
    </View>
    <View style={styles.rightContainer}>
      <Text style={[styles.amount, {color:'#5BDA8C'}]}>+250.95</Text>
      <Text style={styles.date}>Julio 12, 2022</Text>
    </View>
  </View>
  <View style={styles.container}>
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name="home" size={24} color="#7b4ef7" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.title}>EA Sport</Text>
      <Text style={styles.subtitle}>Oficinas KRU</Text>
    </View>
    <View style={styles.rightContainer}>
      <Text style={styles.amount}>-53.95</Text>
      <Text style={styles.date}>Julio 9, 2022</Text>
    </View>
  </View>
  </View>


  <Text style={styles.trans}>Movimientos</Text>
  <GradientBarChart />
  <StatusBar style="light" />
  </ScrollView>
  </SafeAreaView>
  </>
  );
}




const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },


  header: {
    flex: 1,
    marginTop: 30,
    marginLeft: 20,
    flexDirection: 'row',
    marginBottom: 20,
  },


  arrow: {
    resizeMode: 'contain',
    marginTop: 5,
    width: 25,
    height: 25,
    marginRight: 10,
  },


  headerText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#151C2A',
  },


  listMov:{
    marginTop:20,


  },


  trans: {
    fontSize: 21,
    fontWeight: '500',
    paddingLeft: 16,
    color: '#151C2A',
    marginVertical: 15,
  },


  iconContainer: {
    backgroundColor: '#fff',
    padding: 25,
    width:20,
    height:20,
    borderRadius: 50,
    shadowColor: '#CFECF8',
    shadowOffset: { width: 2, height: 7 },
    shadowOpacity: 0.43,
    shadowRadius: 73,
    elevation: 6,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#151C2A',
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    color: '#ec4d5f',
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});
