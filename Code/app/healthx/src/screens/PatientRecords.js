import React, { Component } from "react";
import { Layout, Text, Button } from "react-native-rapi-ui";
import Navbar from "../components/Navbar";
import {
	View,
	FlatList,
	ActivityIndicator,
	Dimensions,
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
			showOldRecords: false,
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

		const refreshRate = 10 * 1000;
		setInterval(() => { this.getData() }, refreshRate);
	}

	renderCard = (data) => {
		return (
			<Section borderRadius={20} style={styles.list}>
				<SectionContent style={{paddingBottom: 0}}>
					<View style={[styles.recordRow]}>
						<View style={[styles.card, { justifyContent: "center" }]}>
							<Ionicons
								name={"fitness-outline"}
								size={70}
								color={themeColor.danger600}
							/>
							<Text fontWeight="bold" size="xl" style={{ alignSelf: "center", color: themeColor.danger600 }}>
								{data.item.heart_rate}BPM
							</Text>
						</View>

						<View style={[styles.card, { justifyContent: "center" }]}>
							<Text fontWeight="bold" size="xl" style={{ alignSelf: "center", color: themeColor.danger600 }}>
								{data.item.body_temperature}°C
							</Text>
							<Ionicons
								name={"thermometer-outline"}
								size={70}
								color={themeColor.danger600}
							/>
						</View>
					</View>

					<View style={[styles.card, { alignSelf: "center" }]}>
						<Ionicons
							name={"speedometer-outline"}
							size={70}
							color={themeColor.danger500}
						/>
						<Text fontWeight="bold" size="xl" style={{ alignSelf: "center", color: themeColor.danger500 }}>
							{data.item.systolic_blood_pressure} / {data.item.diastolic_blood_pressure}
						</Text>
					</View>

					<View style={[styles.card, { alignSelf: "center" }]}>
						<Text fontWeight="bold" size="xl" style={{ alignSelf: "center", color: themeColor.danger400 }}>
							Oxygen Saturation: {data.item.oxygen_saturation * 100}%
						</Text>
						<Ionicons
							name={"heart-circle-outline"}
							size={70}
							color={themeColor.danger400}
						/>
					</View>
				</SectionContent>
				<SectionContent style={{paddingTop: 0}}>
					<View style={styles.card}>
						<Ionicons
							name={"pulse-outline"}
							size={20}
							color={
								this.props.isDarkmode ? themeColor.white100 : themeColor.dark
							}
						/>
						<View style={styles.recordRow}>
							<Text style={styles.lightText}>ECG:</Text>
							<Text style={styles.lightText}>{data.item.ecg}</Text>
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
						<View style={styles.recordRow}>
							<Text style={styles.lightText}>Timestamp:</Text>
							<Text style={styles.lightText}>
								{
									`${new Date(data.item.timestamp).toLocaleDateString('fa-IR')} `
									+ `${new Date(data.item.timestamp).toLocaleTimeString('fa-IR')}`
								}
							</Text>
						</View>
					</View>
				</SectionContent>
			</Section>
		);
	}

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
						<>
							<FlatList
								data={[patientData.slice().reverse()[0]]}
								renderItem={(item) => this.renderCard(item)}
								keyExtractor={(item) => item.id.toString()}
							/>
							<Button
								style={{ marginTop: 10 }}
								text="View Charts"
								leftContent={
									<Ionicons
										name="stats-chart"
										size={20}
										color={themeColor["warning700"]} />
								}
								status="warning700"
								type="TouchableOpacity"
								onPress={() => { this.props.navigation.navigate("ChartsScreen", { patient }) }}
								outline
							/>
							<Button
								style={{ marginTop: 10 }}
								text={`${this.state.showOldRecords ? "Hide" : "Show"} Old Records`}
								rightContent={
									<Ionicons
										name={this.state.showOldRecords ? "chevron-up-outline" : "chevron-down-outline"}
										size={20}
										color={themeColor["info600"]}
									/>
								}
								status="info600"
								type="TouchableOpacity"
								onPress={() => this.setState({ showOldRecords: !this.state.showOldRecords })}
								outline
							/>
							{
								this.state.showOldRecords &&
								<FlatList
									data={patientData.slice().reverse().slice(1)}
									renderItem={(item) => this.renderItem(item)}
									keyExtractor={(item) => item.id.toString()}
								/>
							}
						</>
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
		// height: deviceHeight,
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
		// paddingVertical: 4,
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
	recordRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		flex: 1,
	}
};
