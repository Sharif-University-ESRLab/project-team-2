import React, { Component } from "react";
import { Layout, Text } from "react-native-rapi-ui";
import Navbar from "../components/Navbar";
import {
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Section, SectionContent } from "react-native-rapi-ui";
import { patientsURL } from "../api/base";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, themeColor } from "react-native-rapi-ui";

function withThemeHook(Component) {
  return function WrappedComponent(props) {
    const { isDarkmode } = useTheme();
    return <Component {...props} isDarkmode={isDarkmode} />;
  };
}

class Patients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      patientsData: null,
    };
  }

  getData = () => {
    this.setState({
      fromFetch: false,
      loading: true,
    });
    console.log(patientsURL);

    axios
      .get(patientsURL)
      .then((response) => {
        console.log("getting data from axios", response.data);
        setTimeout(() => {
          this.setState({
            loading: false,
            patientsData: response.data,
          });
        }, 5000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.getData();
  }

  renderItem = (data) => {
    return (
      <TouchableOpacity>
        <Section borderRadius={20} style={styles.list}>
          <SectionContent>
            <View style={styles.card}>
              <Ionicons
                name={
                  data.item.gender === "W" ? "woman-outline" : "man-outline"
                }
                size={20}
                color={
                  this.props.isDarkmode ? themeColor.white100 : themeColor.dark
                }
              />
              <View>
                <Text style={styles.lightText}>
                  {data.item.first_name + " " + data.item.last_name}
                </Text>
                <Text style={styles.lightText}>{data.item.phone}</Text>
              </View>
            </View>
          </SectionContent>
        </Section>
      </TouchableOpacity>
    );
  };

  render() {
    const { loading, patientsData } = this.state;
    return (
      <Layout>
        <Navbar
          pageName="Patients"
          backOption={true}
          navigation={this.props.navigation}
        />
        <View style={styles.parentContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0c9" />
          ) : (
            <FlatList
              data={patientsData}
              renderItem={(item) => this.renderItem(item)}
              keyExtractor={(item) => item.id.toString()}
            />
          )}
        </View>
      </Layout>
    );
  }
}

export default withThemeHook(Patients);

const deviceHeight = Dimensions.get("screen").height;

const styles = {
  parentContainer: {
    height: deviceHeight,
    justifyContent: "center",
  },

  textStyle: {
    fontSize: 18,
    textAlign: "center",
    paddingTop: 32,
    weight: "bold",
  },
  container: {
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  list: {
    paddingVertical: 4,
    margin: 5,
    backgroundColor: "#fff",
  },
  card: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "center"
  },
};