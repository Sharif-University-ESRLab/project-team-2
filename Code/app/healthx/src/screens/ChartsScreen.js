import React, { Component } from "react";
import { Layout, Text, Picker } from "react-native-rapi-ui";
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
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("screen");
const chartWidthRatio = 0.8

function withThemeHook(Component) {
	return function WrappedComponent(props) {
		const { isDarkmode } = useTheme();
		return <Component {...props} isDarkmode={isDarkmode} />;
	};
}

const basicData = [
	{ name: 'Page A', uv: 402, pv: 2400, amt: 2400 },
	{ name: 'Page B', uv: 450, pv: 2400, amt: 2400 },
	{ name: 'Page C', uv: 540, pv: 2400, amt: 2400 },
	{ name: 'Page D', uv: 423, pv: 2400, amt: 2400 },
	{ name: 'Page E', uv: 400, pv: 2400, amt: 2400 },
	{ name: 'Page F', uv: 401, pv: 2400, amt: 2400 },
];

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
			patientData: null,
			patient: props.route.params.patient,
			value: null,
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

		const refreshRate = 60 * 1000;
		setInterval(() => { this.getData() }, refreshRate);
	}

	loadDataByTimePeriod = (timeChar) => {
		switch (timeChar) {
			case "M":

				break;
			case "W":

				break;
			case "A":

				break;
		}
	}

	renderLineChart = (data) => (
		<LineChart width={deviceWidth * chartWidthRatio} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
			<Line type="monotone" dataKey="uv" stroke="#8884d8" />
			<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
			<XAxis dataKey="name" />
			<YAxis />
			<Tooltip />
		</LineChart>
	);

	render() {
		const { loading, patientData, patient, value } = this.state;
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
							<View style={[styles.card, {justifyContent: "center"}]}>
								{this.renderLineChart(basicData)}
							</View>
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
