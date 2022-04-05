import React from "react";
import { View, Linking } from "react-native";
import {
  Layout,
  Text,
  Button,
  Section,
  SectionContent,
  themeColor,
} from "react-native-rapi-ui";
import Navbar  from "../components/Navbar";
import { Ionicons } from "@expo/vector-icons";

export default function ({ navigation }) {
  return (
    <Layout>
      <Navbar navigation={navigation} pageName="Home" backOption={false}/>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Section>
          <SectionContent>
            <Text fontWeight="bold" style={{ textAlign: "center" }}>
              Hardware Lab - Group 2
            </Text>
            <Text style={{ textAlign: "center" }}>
              Spring 2022
            </Text>
            <Button
              style={{ marginTop: 10 }}
              text="Project source code"
              leftContent={
                <Ionicons
                  name="logo-github"
                  size={20}
                  color={themeColor.white}
                />
              }
              status="info"
              onPress={() => Linking.openURL("https://github.com/Sharif-University-ESRLab/project-team-2")}
              type="TouchableOpacity"
            />
            <Button
              text="Patients"
              onPress={() => {
                navigation.navigate("Patients");
              }}
              style={{
                marginTop: 10,
              }}
            />
          </SectionContent>
        </Section>
      </View>
    </Layout>
  );
}
