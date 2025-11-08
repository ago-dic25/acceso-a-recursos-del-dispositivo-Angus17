import { StyleSheet, Text, View, Button, Image, Alert, Platform } from 'react-native'; // <-- Limpiadas las importaciones, añadida Image y Alert
import React, { useState, useEffect, useRef } from 'react'; // <-- Añadido useRef
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera'; // <-- API MODERNA
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  
  // 1. Usar los hooks de permisos modernos
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  
  const [foto, setFoto] = useState(null); // <-- Guardará el URI de la foto
  const [facing, setFacing] = useState('back'); // <-- 'back' o 'front'
  const cameraRef = useRef(null); // <-- 2. Usar useRef para la referencia

  // 3. Pedir permisos al cargar
  useEffect(() => {
    (async () => {
      const cameraStatus = await requestCameraPermission();
      const mediaStatus = await requestMediaPermission();
      
      if (!cameraStatus.granted || !mediaStatus.granted) {
        Alert.alert("Error", "Se necesitan permisos de cámara y galería para continuar.");
      }
    })();
  }, []); // <-- Se ejecuta solo una vez al montar

  // 4. Estados de carga y denegación de permisos
  if (!cameraPermission || !mediaPermission) {
    // Los permisos se están cargando
    return <View />;
  }

  if (!cameraPermission.granted || !mediaPermission.granted) {
    // Los permisos fueron denegados
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Necesitas dar permisos a la cámara y galería.</Text>
        <Button title="Dar Permisos" onPress={() => {
          requestCameraPermission();
          requestMediaPermission();
        }} />
      </View>
    );
  }

  const tomarFoto = async () => {
    if (cameraRef.current) {
      try {
        const datosFoto = await cameraRef.current.takePictureAsync();
        setFoto(datosFoto.uri); // <-- 5. Guardar el URI en el estado
        console.log("Foto tomada:", datosFoto.uri);
      } catch (error) {
        console.log('Error al tomar foto: ' + error);
        Alert.alert("Error", "No se pudo tomar la foto.");
      }
    }
  };

  const guardarFoto = async () => {
    if (foto) {
      try {
        await MediaLibrary.saveToLibraryAsync(foto);
        Alert.alert("Guardada", "La foto se guardó en tu galería.");
        setFoto(null); // <-- Regresar a la vista de cámara
      } catch (error) {
        console.log('Error al guardar: ' + error);
        Alert.alert("Error", "No se pudo guardar la foto.");
      }
    }
  };
  
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // 6. Renderizado condicional: Mostrar preview O cámara
  if (foto) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: foto }} style={styles.preview} />
        <View style={styles.controlsContainer}>
          <Button title="Volver a Tomar" onPress={() => setFoto(null)} />
          <Button title="Guardar Foto" onPress={guardarFoto} />
        </View>
        <StatusBar style="auto" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing} // <-- Usar 'facing'
        ref={cameraRef} // <-- Asignar el ref
      >
        {/* 7. Controles DENTRO del CameraView */}
        <View style={styles.controlsContainer}>
          <Button title="Voltear" onPress={toggleCameraFacing} />
          <Button title="Tomar Foto" onPress={tomarFoto} />
        </View>
      </CameraView>
      <StatusBar style="auto" />
    </View>
  );
}

// 8. Estilos actualizados y limpios
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro para la cámara
    justifyContent: 'center',
  },
  camera: {
    flex: 1, // <-- Ocupa todo el espacio
    justifyContent: 'flex-end', // <-- Pone los controles en la parte inferior
  },
  preview: {
    flex: 1, // <-- La preview ocupa todo el espacio
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo semitransparente
    padding: 20,
    width: '100%',
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  }
});