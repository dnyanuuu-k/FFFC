import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FORM_FONT_SIZE, FORM_SM_FONT_SIZE } from "utils/constants";
import colors from "themes/colors";
import moment from "moment";
import FeatherIcon from "feather-icons-react";
import { YYYYMMDD, DD, DDMMYYYY } from "utils/constants";

const DATE_MODE = 1;
const MONTH_MODE = 2;
const YEAR_MODE = 3;
const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const SHORT_MONTHS = [
	"JAN",
	"FEB",
	"MAR",
	"APR",
	"MAY",
	"JUN",
	"JUL",
	"AUG",
	"SEP",
	"OCT",
	"NOV",
	"DEC",
];
const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
export default class Date extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			mode: DATE_MODE,
			dates: [],
			years: [],

			currentMonth: 0,
			currentYear: 0,
		};
	}

	componentDidMount() {
		this.init();
	}

	handleHeaderPress = () => {
		const mode = this.state.mode;
		if (mode === DATE_MODE) {
			this.setState({
				mode: MONTH_MODE
			})
		}else if(mode === MONTH_MODE){
			this.setYears(this.state.currentYear, 1);
		}
	};

	init = () => {
		const { value } = this.props;
		let parseDate =
			value?.length > 0
				? moment(value, YYYYMMDD)
				: moment();		
		if (!parseDate.isValid()) {
			parseDate = moment();
		}		
		this.setState({
			selected: parseDate.format(YYYYMMDD),
		})
		this.setDate(parseDate);
	};

	handleMonthPress = (currentMonth) => {
		const parseDate = moment();
		const currentYear = this.state.currentYear;
		parseDate.set({
			month: currentMonth,
			year: currentYear
		});
		this.setDate(parseDate);
	}

	handleSelectYear = (currentYear) => {
		this.setState({
			mode: MONTH_MODE,
			currentYear
		})
	}

	getDates = (monthMoment, currentMonth) => {
		const days = [];
		monthMoment.startOf("month");
		const startWeekday = monthMoment.weekday();
		for (let i = 0; i < startWeekday; i++) {
			days.push({ text: "" });
		}
		while (monthMoment.month() === currentMonth) {
			const label = monthMoment.format(YYYYMMDD);
			const text = monthMoment.format(DD);
			const key = monthMoment.format(DDMMYYYY);
			days.push({
				text,
				label,
				key,
			});
			monthMoment.add(1, "days");
		}
		return days;
	};

	setDate = (parseDate) => {
		const currentMonth = parseDate.month();
		const currentYear = parseDate.year();
		const dates = this.getDates(moment(parseDate), currentMonth);
		this.setState({
			mode: DATE_MODE,			
			currentMonth,
			currentYear,
			dates,
		});
	};

	setYears = (currentYear, direction = 1) => {		
		const years = [];
		const indexYear = direction === 1 ? currentYear : currentYear - 9;
		const end = indexYear + 9;
		for(let i = indexYear; i <= end; i++){
			years.push(i)
		}		
		this.setState({
			mode: YEAR_MODE,
			years
		})
	}

	navigate = (direction = 1) => {
		const { currentMonth, currentYear, mode, years } = this.state;
		if(mode === DATE_MODE){
			const currentMoment = moment();
			currentMoment.set({
				year: currentYear,
				month: currentMonth,
			});
			currentMoment.startOf("month");
			if (direction === 1) {
				currentMoment.add("month", 1);
			} else {
				currentMoment.subtract("month", 1);
			}
			this.setDate(currentMoment);
		}else if(mode === YEAR_MODE){
			const year = direction === 1 ? years[years.length - 1] : years[0];
			this.setYears(year, direction);
		}
	};

	handleDateSelect = (date) => {
		this.props.onChange(date);
	}

	renderHeader = (mode, currentYear, currentMonth, years) => {
		let title = "";
		if (mode === DATE_MODE) {
			title = `${MONTHS[currentMonth]} ${currentYear}`;
		}else if(mode === MONTH_MODE){
			title = `${currentYear}`;
		}else{
			title = `${years?.[0]} - ${years?.[years.length - 1]}`
		}
		return (
			<>
				<TouchableOpacity
					style={style.icon}
					onPress={() => this.navigate(-1)}
				>
					<FeatherIcon
						size={20}
						color={colors.textBlack}
						icon="chevrons-left"
					/>
				</TouchableOpacity>
				<Text onPress={this.handleHeaderPress} style={style.title}>
					{title}
				</Text>
				<TouchableOpacity
					style={style.icon}
					onPress={() => this.navigate(1)}
				>
					<FeatherIcon
						size={20}
						color={colors.textBlack}
						icon="chevrons-right"
					/>
				</TouchableOpacity>
			</>
		);
	};

	renderContent = (mode, dates, years) => {
		if (mode === DATE_MODE) {
			return (
				<>
					{weekdays.map((w) => (
						<View key={w} style={style.dateCover}>
							<Text
								style={[
									style.dateText,
									{ color: colors.primaryBlue },
								]}
							>
								{w}
							</Text>
						</View>
					))}
					{dates.map((date) => {
						const selected = this.state.selected === date.label;
						const backgroundColor = selected
							? colors.primaryBlue
							: colors.popupBg;
						const dateStyle = {
							...style.dateCover,
							backgroundColor,
						};
						const color = selected
							? colors.buttonTxt
							: colors.textBlack;
						return (
							<TouchableOpacity
								key={date.key}
								style={dateStyle}
								onPress={() => this.handleDateSelect(date.label)}
							>
								<Text style={[style.dateText, { color }]}>
									{date.text}
								</Text>
							</TouchableOpacity>
						);
					})}
				</>
			);
		} else if (mode === MONTH_MODE) {
			return SHORT_MONTHS.map((month) => {
				return (
					<TouchableOpacity key={month} onPress={() => this.handleMonthPress(month)} style={style.monthStyle}>
						<Text style={style.dateText}>{month}</Text>
					</TouchableOpacity>
				);
			});
		} else if (mode === YEAR_MODE) {
			return years.map((year) => {
				return (
					<TouchableOpacity key={year} onPress={() => this.handleSelectYear(year)} style={style.monthStyle}>
						<Text style={style.dateText}>{year}</Text>
					</TouchableOpacity>
				);
			});
		}
		return null;
	};

	render() {
		const { mode, dates, years, currentYear, currentMonth } =
			this.state;
		return (
			<>
				<View style={style.header}>
					{this.renderHeader(mode, currentYear, currentMonth, years)}
				</View>
				<View style={style.content}>
					{this.renderContent(mode, dates, years)}
				</View>
				<TouchableOpacity style={style.footer}>
					<Text style={style.footerText}>Clear</Text>
				</TouchableOpacity>
			</>
		);
	}
}

const style = {
	icon: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	header: {
		justifyContent: "space-between",
		paddingHorizontal: 10,
		height: 40,
		width: "100%",
		borderBottomWidth: 1,
		flexDirection: "row",
		alignItems: "center",
		borderColor: colors.borderColor,
	},
	footer: {
		height: 40,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		borderTopWidth: 1,
		borderColor: colors.borderColor,
	},
	footerText: {
		fontSize: FORM_FONT_SIZE,
		fontWeight: "bold",
		color: colors.primaryBlue,
	},
	dateCover: {
		borderRadius: 100,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 10,
		width: 30,
		height: 30,
	},
	monthStyle: {
		height: 60,
		width: 70,
		justifyContent: "center",
		alignItems: "center",
	},
	dateText: {
		fontSize: FORM_SM_FONT_SIZE,
		fontWeight: "bold",
		color: colors.textBlack,		
		textAlign: "center",
	},
	title: {
		fontSize: FORM_FONT_SIZE,
		color: colors.textBlack,
		fontWeight: "bold",
	},
};