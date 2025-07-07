import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image , Dimensions, Button, Pressable, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import Header from '../components/header.js';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TicketCard from "../components/TicketCard.js";
import GradientBarChart from '../components/GradientBarChart.js';
import home from './home.js';

//import Carousel from 'react-native-snap-carousel';

const width = Dimensions.get('window').width;
const arrow = { uri: 'https://cdn-icons-png.flaticon.com/512/154/154630.png' };
const transactions = [
  {
    icon: "home",
    title: "Ariana grande",
    subtitle: "Concierto en obras",
    amount: -53.95,
    date: "Julio 14, 2022",
    color: "#7b4ef7",
  },
  {
    icon: "home",
    title: "Garden Party",
    subtitle: "Jardín Botánico",
    amount: 250.95,
    date: "Julio 12, 2022",
    color: "#7b4ef7",
    amountColor: "#5BDA8C"
  },
  {
    icon: "home",
    title: "EA Sport",
    subtitle: "Oficinas KRU",
    amount: -53.95,
    date: "Julio 9, 2022",
    color: "#7b4ef7",
  },
];

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
      {transactions.map((tx, idx) => (
          <View style={styles.container} key={idx}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name={tx.icon} size={24} color={tx.color} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{tx.title}</Text>
              <Text style={styles.subtitle}>{tx.subtitle}</Text>
            </View>
            <View style={styles.rightContainer}>
              <Text
                style={[
                  styles.amount,
                  tx.amountColor && { color: tx.amountColor }
                ]}
              >
                {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
              </Text>
              <Text style={styles.date}>{tx.date}</Text>
            </View>
          </View>
        ))}
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
