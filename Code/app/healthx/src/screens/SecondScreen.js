import React from "react";
import { View } from "react-native";
import {
  Layout,
  Text,
} from "react-native-rapi-ui";
import Navbar  from "../components/Navbar";

export default function ({ navigation }) {
  return (
    <Layout>
      <Navbar pageName="Second Screen" backOption={true} navigation={navigation}/>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* This text using ubuntu font */}
        <Text fontWeight="bold">This is the second screen</Text>
      </View>
    </Layout>
  );
}
