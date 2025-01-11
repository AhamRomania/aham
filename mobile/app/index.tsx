import { Stack } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {

  return (
    <View
      style={{
        flex: 1,
        borderColor: "white",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#286fb4",
      }}
    >
      <Stack.Screen options={{title:"Aham"}} />
      <Text style={style.text}>Hello World!</Text>
    </View>
  );
}

const style = StyleSheet.create({
  text: {
    color: "white",
  }
});