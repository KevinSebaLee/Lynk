import { View, Image, Text } from 'react-native';
import Container from './container.js';

export default function Header(props) {
  return (
    <Container style={{ 
      flexDirection: 'row', 
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image 
          source={require('../../assets/img/hamburgerIcon.png')}
          style={{ width: 40, height: 40, marginRight: 10 }}
        />
        <Text style={{ color: 'white', fontSize: 18 }}>{props.nombre}</Text>
      </View>

      <Image
        source={require('../../assets/img/notifIcon.png')}
        style={{ width: 40, height: 40 }}
      />
    </Container>
  );
}