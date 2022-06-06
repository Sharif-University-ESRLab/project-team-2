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
import { AreaChart, Area, LineChart, Line, ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, ZAxis, Label, Tooltip, ResponsiveContainer, Legend } from "recharts";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("screen");
const chartWidthRatio = 0.8

function withThemeHook(Component) {
	return function WrappedComponent(props) {
		const { isDarkmode } = useTheme();
		return <Component {...props} isDarkmode={isDarkmode} />;
	};
}

const timeOptions = [
	{ label: "Last Year", value: "A" },
	{ label: "Last Week", value: "W" },
	{ label: "Last Month", value: "M" },
	{ label: "Last Day", value: "D" },
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
			case "A":
				date.setFullYear(date.getMonth() - 12);
				timeFilter = `&from=${this.getISODate(date)}`;
				break;
			default: // D or null
				date.setMonth(date.getDate() - 1);
				timeFilter = `&from=${this.getISODate(date)}`;
				break;

		}
		this.getData(timeFilter);
	}

	getData = (timeFilter) => {
		this.setState({
			fromFetch: false,
			// loading: true,
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

	componentDidMount() {
		this.getData();

		const refreshRate = 5 * 1000;
		setInterval(() => { this.getData() }, refreshRate);
	}


	cleanData = (data) => {
		for (let item of data) {
			item['time'] = new Date(item['timestamp']).toTimeString().slice(0, 9)
			item['date'] = this.getISODate(new Date(item['timestamp']))
		}
		return data;
	}

	renderLineChart = (data) => (
		<ResponsiveContainer width="100%" height={250}>
			<LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
				<Line type="monotone" dataKey="oxygen_saturation" stroke="#8884d8" />
				<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
				<XAxis dataKey="date" />
				<YAxis />
				<Tooltip />
			</LineChart>
		</ResponsiveContainer>
	);

	renderECGLineChart = (data) => {
		console.log("ECG", data)
		return (
		<ResponsiveContainer width="100%" height={250}>
			<LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
				<Line type="monotone" dataKey="ecg" stroke="#8884d8" />
				<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
				<XAxis dataKey="time" />
				<YAxis />
				<Tooltip />
			</LineChart>
		</ResponsiveContainer>
	);
	}

	renderAreaChart = (data) => (
		<ResponsiveContainer width="100%" height={300}>
			<AreaChart data={data}
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
				<XAxis dataKey="date" />
				<YAxis />
				<CartesianGrid strokeDasharray="3 3" />
				<Tooltip />
				<Area type="monotone" dataKey="body_temperature" name="Body" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
				<Area type="monotone" dataKey="environment_temperature" name="Environment" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
				<Legend verticalAlign="top" height={36} />
			</AreaChart>
		</ResponsiveContainer>
	);

	renderScatterChart = (data, x_key, x_name, color) => (
		<ResponsiveContainer width="100%" height={260}>
			<ScatterChart
				margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey={x_key} name={x_name}>
					<Label value={x_name} offset={-5} position="insideBottom" />
				</XAxis>
				<YAxis dataKey="oxygen_saturation" name="O2 Saturation"
					label={{ value: 'O2 Saturation', angle: -90, position: 'insideLeft' }}
				/>
				<ZAxis dataKey="body_temperature" range={[30, 145]} name="Body Temperature" unit="°C" />
				<Tooltip cursor={{ strokeDasharray: '3 3' }} />
				<Legend verticalAlign="top" height={36} />
				<Scatter name="Body Temperature" data={data} fill={color} />
			</ScatterChart>
		</ResponsiveContainer>
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
									<View style={[styles.card, styles.chart]}>
										<Text>ECG</Text>
										{this.renderECGLineChart(this.state.chartsData)}
									</View>
									<View style={[styles.card, styles.chart]}>
										<Text>Oxygen Saturation</Text>
										{this.renderLineChart(this.state.chartsData)}
									</View>
									<View style={[styles.card, styles.chart]}>
										<Text>Body and Environment Temperature</Text>
										{this.renderAreaChart(this.state.chartsData)}
									</View>
									<View style={[styles.card, styles.chart]}>
										<Text>Air pollution vs. Body Temperature and Oxygen Saturaion</Text>
										{this.renderScatterChart(this.state.chartsData, "air_pollution", "Air Pollution", "#ff5259")}
									</View>
									<View style={[styles.card, styles.chart]}>
										<Text>Humidity vs. Oxygen Saturaion and Body Temperature</Text>
										{this.renderScatterChart(this.state.chartsData, "relative_humidity", "Relative Humidity", "#53a7ba")}
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
	},
	chart: {
		justifyContent: "center",
		marginTop: 20,
	}
};
