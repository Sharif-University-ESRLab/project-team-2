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
import { patientRecordsURL } from "../api/base";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, themeColor } from "react-native-rapi-ui";

function withThemeHook(Component) {
	return function WrappedComponent(props) {
		const { isDarkmode } = useTheme();
		return <Component {...props} isDarkmode={isDarkmode} />;
	};
}

class PatientRecords extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			patientData: null,
			patient: props.route.params.patient,
		};
	}

	getData = () => {
		this.setState({
			fromFetch: false,
			loading: true,
		});

		axios
			.get(patientRecordsURL(this.state.patient.id))
			.then((response) => {
				console.log("getting data from axios", response.data);
				setTimeout(() => {
					this.setState({
						loading: false,
						patientData: response.data,
					});
				}, 1000);
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
								name={"fitness-outline"}
								size={20}
								color={
									this.props.isDarkmode ? themeColor.white100 : themeColor.dark
								}
							/>
							<View>
								<Text style={styles.lightText}>{`Heart Rate: ${data.item.heart_rate}BPM`}</Text>
							</View>
						</View>
						
						<View style={styles.card}>
							<Ionicons
								name={"thermometer-outline"}
								size={20}
								color={
									this.props.isDarkmode ? themeColor.white100 : themeColor.dark
								}
							/>
							<View>
								<Text style={styles.lightText}>{`Body Temperature: ${data.item.body_temperature}°C`}</Text>
							</View>
						</View>
						
						<View style={styles.card}>
							<Ionicons
								name={"speedometer-outline"}
								size={20}
								color={
									this.props.isDarkmode ? themeColor.white100 : themeColor.dark
								}
							/>
							<View>
								<Text style={styles.lightText}>
									{`Blood Pressure: ${data.item.systolic_blood_pressure} over ${data.item.diastolic_blood_pressure}`}
								</Text>
							</View>
						</View>
						
						<View style={styles.card}>
							<Ionicons
								name={"pulse-outline"}
								size={20}
								color={
									this.props.isDarkmode ? themeColor.white100 : themeColor.dark
								}
							/>
							<View>
								<Text style={styles.lightText}>{`ECG: ${data.item.ecg}`}</Text>
							</View>
						</View>
						
						<View style={styles.card}>
							<Ionicons
								name={"heart-circle-outline"}
								size={20}
								color={
									this.props.isDarkmode ? themeColor.white100 : themeColor.dark
								}
							/>
							<View>
								<Text style={styles.lightText}>{`Oxygen Saturation: ${data.item.oxygen_saturation}`}</Text>
							</View>
						</View>
						
						<View style={styles.card}>
							<Ionicons
								name={"calendar-outline"}
								size={20}
								color={
									this.props.isDarkmode ? themeColor.white100 : themeColor.dark
								}
							/>
							<View>
								<Text style={styles.lightText}>
									{`Timestamp: ${(new Date(data.item.timestamp).toString())}`}
								</Text>
							</View>
						</View>
					</SectionContent>
				</Section>
			</TouchableOpacity>
		);
	};

	render() {
		const { loading, patientData, patient } = this.state;
		return (
			<Layout>
				<Navbar
					pageName={patient.first_name + " " + patient.last_name}
					backOption={true}
					navigation={this.props.navigation}
				/>
				<View style={styles.parentContainer}>
					{loading ? (
						<ActivityIndicator size="large" color="#0c9" />
					) : (
						<FlatList
							data={patientData.slice().reverse()}
							renderItem={(item) => this.renderItem(item)}
							keyExtractor={(item) => item.id.toString()}
						/>
					)}
				</View>
			</Layout>
		);
	}
}

export default withThemeHook(PatientRecords);

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
		alignContent: "center",
		marginBottom: 10,
	},
};
