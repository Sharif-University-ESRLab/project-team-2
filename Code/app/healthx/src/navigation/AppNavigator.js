import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/Home";
import Patients from "../screens/Patients";
import PatientRecords from "../screens/PatientRecords";
import ChartsScreen from "../screens/ChartsScreen";

const MainStack = createNativeStackNavigator();

const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="Home" component={Home} />
      <MainStack.Screen name="Patients" component={Patients} />
      <MainStack.Screen name="PatientRecords" component={PatientRecords} />
      <MainStack.Screen name="ChartsScreen" component={ChartsScreen} />
    </MainStack.Navigator>
  );
};

export default () => {
  return (
    <NavigationContainer>
      <Main />
    </NavigationContainer>
  );
};
