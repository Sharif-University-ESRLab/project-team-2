import React, { Component } from "react";
import { Layout, Text, Picker, Section, SectionContent } from "react-native-rapi-ui";
import Navbar from "../components/Navbar";
import {
	View,
	ActivityIndicator,
	Dimensions,
} from "react-native";
import axios from "axios";
import { patientRecordsURL } from "../api/base";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, themeColor } from "react-native-rapi-ui";
import { AreaChart, Area, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("screen");
const chartWidthRatio = 0.8

function withThemeHook(Component) {
	return function WrappedComponent(props) {
		const { isDarkmode } = useTheme();
		return <Component {...props} isDarkmode={isDarkmode} />;
	};
}

const timeOptions = [
	{ label: "All time", value: "A" },
	{ label: "Last Week", value: "W" },
	{ label: "Last Month", value: "M" },
];

class ChartsScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			chartsData: null,
			patient: props.route.params.patient,
			value: null,
		};
	}

	getISODate = (date) => {
		return date.toISOString().slice(0, 10);
	}

	loadDataByTimePeriod = (timeChar) => {
		let timeFilter = "";

		let date = new Date();
		switch (timeChar) {
			case "M":
				date.setMonth(date.getMonth() - 1);
				timeFilter = `&from=${this.getISODate(date)}`;
				break;
			case "W":
				date.setDate(date.getDate() - 7);
				timeFilter = `&from=${this.getISODate(date)}`;
				break;
			default: // A or null
				break;
		}
		this.getData(timeFilter);
	}

	getData = (timeFilter) => {
		this.setState({
			fromFetch: false,
			loading: true,
		});

		let recordsUrl = patientRecordsURL(this.state.patient.id);
		if (!!timeFilter) {
			recordsUrl += timeFilter;
		}

		axios
			.get(recordsUrl)
			.then((response) => {
				console.log("getting data from axios", response.data);
				setTimeout(() => {
					this.setState({
						loading: false,
						chartsData: this.cleanData(response.data),
					});
				}, 100);
			})
			.catch((error) => {
				console.log(error);
				this.setState({
					loading: false,
					chartsData: [],
				});
			});
	};

	cleanData = (data) => {
		return data;
	}

	renderLineChart = (data) => (
		<LineChart width={deviceWidth * chartWidthRatio} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
			<Line type="monotone" dataKey="oxygen_saturation" stroke="#8884d8" />
			<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
			<XAxis dataKey="timestamp" />
			<YAxis />
			<Tooltip />
		</LineChart>
	);

	renderAreaChart = (data) => (
		<AreaChart width={deviceWidth * chartWidthRatio} height={300} data={data}
			margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
			<defs>
				<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
					<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
					<stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
				</linearGradient>
				<linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
					<stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
					<stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
				</linearGradient>
			</defs>
			<XAxis dataKey="timestamp" />
			<YAxis />
			<CartesianGrid strokeDasharray="3 3" />
			<Tooltip />
			<Area type="monotone" dataKey="body_temperature" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
			<Area type="monotone" dataKey="environment_temperature" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
		</AreaChart>
	);

	render() {
		const { loading, patient, value } = this.state;
		return (
			<Layout>
				<Navbar
					pageName={patient.first_name + " " + patient.last_name}
					backOption={true}
					navigation={this.props.navigation}
				/>
				<View style={styles.parentContainer}>
					<Section style={{ marginHorizontal: 20, marginTop: 20 }}>
						<SectionContent>
							<View style={{ marginBottom: 20 }}>
								<View style={styles.card}>
									<Ionicons
										name="calendar-outline"
										size={20}
										color={
											this.props.isDarkmode ? themeColor.white100 : themeColor.dark
										}
									/>
									<Text style={{ marginLeft: 3 }}>Time period</Text>
								</View>
								<Picker
									items={timeOptions}
									value={value}
									placeholder="Choose the time"
									onValueChange={(val) => {
										this.setState({ value: val });
										this.loadDataByTimePeriod(val);
									}}
								/>
							</View>
							{loading && !!this.state.chartsData ? (
								<ActivityIndicator size="large" color="#0c9" />
							) : (
								<View>
									<View style={[styles.card, { justifyContent: "center" }]}>
										<Text>Oxygen Saturation</Text>
										{this.renderLineChart(this.state.chartsData)}
									</View>
									<View style={[styles.card, { justifyContent: "center" }]}>
										<Text>Body and Environment Temperature</Text>
										{this.renderAreaChart(this.state.chartsData)}
									</View>
								</View>
							)}
						</SectionContent>
					</Section>
				</View>
			</Layout>
		);
	}
}

export default withThemeHook(ChartsScreen);

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
