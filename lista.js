import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useState } from 'react';
import { FlatList } from 'react-native-web';


export default function Lista({listaAlumnos}) {

    function agregarAlumnoALista(nombreAlumno){
    setListaAlumnos([...listaAlumnos, nombreAlumno]);
  }

  return (
      <View style={styles.container}>
        <TextInput
          placeholder="Escribe tu nombre"
          value={nombre}
          onChangeText={setNombre}
          onSubmitEditing={(event) => console.log(event.nativeEvent.text)}
        />
        <br />
        
        <Text>{mensaje}</Text>
        <br />
        <Button title='Mostrar Nombre' onPress={() => contadorCaracteresNombre(nombre)} />
        <br />
        <Button title="Limpiar el nombre" onPress={() => setNombre('')} />
        <br />
        <Button title="Agregar Alumno" onPress={() => agregarAlumnoALista(nombre)} />
  
        <FlatList
          data={listaAlumnos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text>{item}</Text>}
        />
  
        <StatusBar style="auto" />
      </View>
    );

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});