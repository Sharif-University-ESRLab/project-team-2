import React, { Component } from "react";
import { Layout, Text, Button, TextInput } from "react-native-rapi-ui";
import Navbar from "../components/Navbar";
import {
	View,
	ScrollView,
	FlatList,
	ActivityIndicator,
	Dimensions,
} from "react-native";
import axios from "axios";
import { Section, SectionContent } from "react-native-rapi-ui";
import { patientlatestRecordsURL, recordsURL, patientRecordsURL } from "../api/base";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, themeColor } from "react-native-rapi-ui";

function withThemeHook(Component) {
	return function WrappedComponent(props) {
		const { isDarkmode } = useTheme();
		return <Component {...props} isDarkmode={isDarkmode} />;
	};
}

/**
 * the main screen of the app, where the
 * history of the patient's records are available
 */
class PatientRecords extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			patientData: null,
			latestData: null,
			patient: props.route.params.patient,
			showOldRecords: false,
			systolic: '',
			diastolic: '',
			reference: null,
		};
	}

	/**
	 * Get data from the server
	 */
	getData = () => {
		this.setState({
			fromFetch: false,
			// loading: true,
		});
		
		axios
		.get(patientlatestRecordsURL(this.state.patient.id))
		.then((response) => {
			console.log("getting data from axios", response.data);
			setTimeout(() => {
				this.setState({
					latestData: response.data,
				});
			}, 200);
		})
		.catch((error) => {
			console.log(error);
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

	/**
	 * Post blood pressure to server
	 */
	submitPressure = () => {
		const { systolic, diastolic, patient } = this.state;
		if (isNaN(systolic) || isNaN(diastolic)) return;

		let data = {
			'systolic_blood_pressure': +systolic,
			'diastolic_blood_pressure': +diastolic,
			'patient': patient.id
		}

		console.log(data);
		axios.post(recordsURL, data);
	}

	componentDidMount() {
		this.getData();

		const refreshRate = 10 * 1000;
		setInterval(() => { this.getData() }, refreshRate);
	}

	/**
	 * Renders the top card in the PatientsRecords screen
	 * @param {Object} data an object containing all the records
	 */
	renderCard = (data) => {
		return (
			<Section borderRadius={20} style={styles.list}>
				<SectionContent style={{ paddingBottom: 0 }}>
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
							Oxygen Saturation: {data.item.oxygen_saturation}%
						</Text>
						<Ionicons
							name={"heart-circle-outline"}
							size={70}
							color={themeColor.danger400}
						/>
					</View>
				</SectionContent>
				<SectionContent style={{ paddingTop: 0 }}>
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

	/**
	 * Renders each item in the bottom list of the screen
	 * @param {Object} data an object containing all the records
	 */
	renderOldItem = (data) => {
		let empty_items = 0
		if (!data.item.oxygen_saturation || !data.item.body_temperature )
			empty_items += 1
		if (!data.item.heart_rate)
			empty_items += 1
		if (!data.item.systolic_blood_pressure )
			empty_items += 1

		console.log(empty_items)
			
		if (empty_items > 2)
				return (<></>)

		return (
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
						<View style={styles.recordRow}>
							<Text style={styles.lightText}>Heart Rate:</Text>
							<Text style={styles.lightText}>{data.item.heart_rate}BPM</Text>
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
						<View style={styles.recordRow}>
							<Text style={styles.lightText}>Body Temperature:</Text>
							<Text style={styles.lightText}>{data.item.body_temperature}°C</Text>
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
						<View style={styles.recordRow}>
							<Text style={styles.lightText}>Blood Pressure:</Text>
							<Text style={styles.lightText}>{data.item.systolic_blood_pressure} / {data.item.diastolic_blood_pressure}</Text>
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
						<View style={styles.recordRow}>
							<Text style={styles.lightText}>ECG:</Text>
							<Text style={styles.lightText}>{data.item.ecg}</Text>
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
						<View style={styles.recordRow}>
							<Text style={styles.lightText}>Oxygen Saturation:</Text>
							<Text style={styles.lightText}>{data.item.oxygen_saturation}</Text>
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
	};

	render() {
		const { loading, patientData, latestData, patient, systolic, diastolic, reference } = this.state;

		return (
			<Layout>
				<Navbar
					pageName={patient.first_name + " " + patient.last_name + "  ID: " + patient.id}
					backOption={true}
					navigation={this.props.navigation}
				/>
				<ScrollView style={styles.parentContainer} ref={ref => {reference = ref}}>
					{loading ? (
						<ActivityIndicator size="large" color="#0c9" />
					) : (
						<>
							<Button
								style={{ marginTop: 10, transform: [{ scale: deviceHeight < 600 ? 1 : 0 }]}}
								text="Scroll Down"
								rightContent={
									<Ionicons
										name="paper-plane"
										size={20}
										color={themeColor["success700"]} />
								}
								status="success700"
								type="TouchableOpacity"
								onPress={() => { reference.scrollToEnd({ animated: true }) }}>
							</Button>
							<FlatList
								data={[latestData]}
								renderItem={(item) => this.renderCard(item)}
								keyExtractor={(item) => item.id.toString()}
							/>
						</>
					)}
					<Section style={{ marginHorizontal: 20, marginTop: 20 }}>
						<SectionContent>
							<Text fontWeight="regular" style={{ textAlign: "center", marginBottom: 10 }}>
								Submit Your Blood Pressure
							</Text>
							<View>
								<TextInput
									placeholder="Systolic pressure"
									value={systolic}
									onChangeText={(val) => this.setState({ systolic: val })}
									rightContent={
										<Ionicons name="arrow-up" size={20} color={themeColor.gray300} />
									}
								/>
								<TextInput
									placeholder="Diastolic pressure"
									value={diastolic}
									onChangeText={(val) => this.setState({ diastolic: val })}
									rightContent={
										<Ionicons name="arrow-down" size={20} color={themeColor.gray300} />
									}
								/>
							</View>
							<Button
								style={{ marginTop: 10 }}
								text="Submit"
								rightContent={
									<Ionicons
										name="paper-plane"
										size={20}
										color={themeColor["success700"]} />
								}
								status="success700"
								type="TouchableOpacity"
								onPress={() => { this.submitPressure() }}
								outline
							/>
						</SectionContent>
					</Section>
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
						(!loading && this.state.showOldRecords) && (
							<FlatList
								data={patientData.slice().reverse().slice(1)}
								renderItem={(item) => this.renderOldItem(item)}
								keyExtractor={(item) => item.id.toString()}
							/>
						)
					}
				</ScrollView>
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
