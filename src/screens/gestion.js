import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image , Dimensions} from 'react-native';
import Header from '../components/header.js';
import Container from '../components/container.js';
import { LinearGradient } from 'expo-linear-gradient';
//import Carousel from 'react-native-snap-carousel';

const width = Dimensions.get('window').width;

export default function gestion() {
  
  // const carouselItems = [
  //   { title: 'Promo 1', text: '50% en tu primera compra' , bgImage: require('./assets/img/lollapalooza.jpg')},
  //   { title: 'Promo 2', text: '2x1 en recargas los lunes' },
  //   { title: 'Promo 3', text: 'Plan premium gratis 7 días' },
  // ];
  

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#642684', '#ffffff']} style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Header nombre='Kevin' />

        <Container>
          <View style={styles.tickets}>
            <View style={styles.textoTicket}>
              <Text>Tickets Disponibles</Text>
              <Text style={styles.movimientosText}>Movimientos</Text>
            </View>

            <View style={styles.ticketTotal}>
              <View style={styles.cantidadTickets}>
                <Image source={require('../../assets/img/icons/tickets.png')} style={styles.iconTicket} />
                <Text style={styles.numeroTickets}>50.000</Text>
              </View>
              <Image source={require('../../assets/img/icons/comprar.png')} style={styles.iconCart} />
            </View>

            <View style={styles.metodoPagoWrapper}>
              <View style={styles.metodoPago}>
                <Image source={require('../../assets/img/icons/mercadoPago.png')} style={styles.iconLarge} />
                <Image source={require('../../assets/img/icons/qr.png')} style={styles.iconSmall} />
              </View>
            </View>
          </View>
        </Container>

       
      </LinearGradient>
    </View>
  );
}


const styles = StyleSheet.create({
  carouselItem: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  carousel: {
    marginTop: 20,
  },
  carouselBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 0.6,
  },  
  tickets: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  textoTicket: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 5,
    marginBottom: 10,
  },
  ticketTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cantidadTickets: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  numeroTickets: {
    fontSize: 40,
    fontWeight: '600',
  },
  iconTicket: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  iconCart: {
    width: 30,
    height: 30,
  },
  metodoPagoWrapper: {
    marginHorizontal: 5,
    marginTop: 15,
  },
  metodoPago: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 5,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  iconLarge: {
    width: 32,
    height: 32,
  },
  iconSmall: {
    width: 24,
    height: 24,
  },
  movimientosText: {
    color: '#9F4B97',
    fontWeight: '500',
  },
  planPremium: {
    borderRadius: 10,
    marginTop: 20,
    overflow: 'hidden',
  },
  tituloPremium:{
    fontSize: 23,
    color: '#ffffff',
    textDecorationStyle: 'solid'
  },  
});