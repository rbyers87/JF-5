import { MapView, Marker, Polygon } from 'expo-maps';
import { StyleSheet, View } from 'react-native';

export function NativeMap({ location, jurisdictions }) {
  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={location} pinColor="#1e40af" />
        {jurisdictions.map((jur) => (
          jur.boundary?.length > 0 && (
            <Polygon
              key={jur.id}
              coordinates={jur.boundary.map(coord => ({
                latitude: coord[1],
                longitude: coord[0]
              }))}
              fillColor="rgba(30, 64, 175, 0.3)"
            />
          )
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 }
});
