import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

// Third-Party Components
import { Tooltip } from "react-tooltip";

// Custom Component
import Shimmer, { ShimmerView } from "components/shimmer/";
import SubmissionCard from "components/submission/card";
import Preloader from "components/preloader/basic";
import Image from "components/image";

// Constants
import { FULLBAR_WIDTH, BORDER_RADIUS } from "utils/constants";
import colors from "themes/colors";
import shadows from "themes/shadows";

// Helper Functions
import Backend from "backend";

const festivalWidth = FULLBAR_WIDTH * 0.65;
const cardWidth = festivalWidth / 2 - 30;

class FestivalContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			error: false,

			title: "Mexico International Shorts Festival",
			seasonText: "Current Season",
			totalGross: "4,5000.21",
			totalNet: "4,3410.11",
			amountSettled: "3,1230",
			amountRemaining: "1,2120.11",
			currency: "₹",
			submissions: [
				{
					trackingId: "MUISFF26",
					title: "Director of Holland City and Facebook Girl",
					director: "Deepak Rathod",
					category: "Short Film",
					date: "Aug 3, 2023",
					origin: "India",
					runtime: "33:22",
				},
				{
					trackingId: "MUISFF27",
					title: "Dhai Kilo Ka haath",
					director: "Sunil Kandera",
					category: "Short Film",
					date: "Aug 3, 2023",
					origin: "India",
					runtime: "33:22",
				},
			],
		};
	}

	componentDidMount() {
		this.loadFestivalHome();
	}

	loadFestivalHome = async () => {
		try {
			this.setState({ loading: true });
			const response = await Backend.Home.Festival();
			if (response?.success) {
				this.setState(response.data);
			} else {
				throw new Error(response.message);
			}
		} catch (err) {
			this.setState({ error: false, errorText: err.message });
		} finally {
			this.setState({
				loading: false,
			});
		}
	};

	renderSubmission = (data, index) => (
		<SubmissionCard width={cardWidth} data={data} key={index} />
	);
	render() {
		const {
			title,
			seasonText,
			currency,
			totalGross,
			totalNet,
			amountSettled,
			amountRemaining,
			submissions,

			loading,
			error,
		} = this.state;
		return (
			<View style={style.main}>
				<Preloader
					onRetry={this.loadFestivalHome}
					hasError={error}
					isBusy={loading}
					isEmpty={false}
					CustomLoader={FestivalShimmer}
				>
					<View style={style.header}>
						<View style={style.headerRow}>
							<Image style={style.logo} />

							<View style={style.content}>
								<Text style={style.title}>{title}</Text>
								<Text style={style.seasonText}>
									{seasonText}
								</Text>

								<View style={style.statRow}>
									<View style={style.statBox}>
										<StatRow
											title="Total Gross"
											value={totalGross}
											color={colors.textBlack}
											currency={currency}
										/>
										<StatRow
											title="Total Net"
											value={totalNet}
											color={colors.primaryBlue}
											currency={currency}
										/>
									</View>
									<View style={style.statVr} />
									<View style={style.statBox}>
										<StatRow
											title="Settled"
											value={amountSettled}
											color={colors.greenDark}
											currency={currency}
										/>
										<StatRow
											title="Remaining"
											value={amountRemaining}
											color={colors.darkOrange}
											currency={currency}
										/>
									</View>
								</View>
							</View>
						</View>

						<View style={style.tabCover}>
							<View style={style.tabRight}>
								<Text style={style.tabText}>Payouts</Text>
								<Text style={style.tabText}>Manage</Text>
								<Text style={style.tabText}>Edit</Text>
							</View>

							<Text style={style.viewText}>View</Text>
						</View>
					</View>

					<View style={style.cardRow}>
						{submissions.map(this.renderSubmission)}
					</View>
				</Preloader>

				<Tooltip
					anchorSelect=".sb-status"
					content="Submission Status"
					style={style.tooltip}
				/>

				<Tooltip
					anchorSelect=".sb-flag"
					content="Flag"
					style={style.tooltip}
				/>

				<Tooltip
					anchorSelect=".sb-judge"
					content="Judge Status"
					style={style.tooltip}
				/>
				<Tooltip
					anchorSelect=".sb-assign"
					content="Assign Judge"
					style={style.tooltip}
				/>
			</View>
		);
	}
}

const StatRow = ({ title, value, color, currency }) => (
	<View style={style.statField}>
		<Text style={style.statTitle}>{title}</Text>
		<Text style={[style.statValue, { color }]}>
			{currency}
			{value}
		</Text>
	</View>
);

const FestivalShimmer = () => {
	return (
		<>
		<View style={style.header}>
			<Shimmer>
				<View style={style.headerRow}>
					<ShimmerView style={shimmerStyle.logo} />
					<View style={style.content}>
						<ShimmerView style={shimmerStyle.title} />
						<ShimmerView style={shimmerStyle.desc} />

						<View style={style.statRow}>
							<View style={style.statBox}>
								<ShimmerView style={shimmerStyle.statVal} />
								<ShimmerView style={shimmerStyle.statVal} />
							</View>
							<View style={style.statVr} />
							<View style={style.statBox}>
								<ShimmerView style={shimmerStyle.statVal} />
								<ShimmerView style={shimmerStyle.statVal} />
							</View>
						</View>
					</View>
				</View>

				<View style={style.tabCover}>
					<View style={style.tabRight}>
						<ShimmerView style={shimmerStyle.tab} />
						<ShimmerView style={shimmerStyle.tab} />
						<ShimmerView style={shimmerStyle.tab} />
					</View>

					<ShimmerView style={shimmerStyle.viewTab} />
				</View>
			</Shimmer>
		</View>

		<View style={style.cardRow}>
			<CardShimmer />
			<CardShimmer />
		</View>		
		</>
	);
};

const CardShimmer = () => (
	<View style={shimmerStyle.card}>
		<Shimmer>
			<ShimmerView style={shimmerStyle.title} />
			<ShimmerView style={shimmerStyle.desc} />
		</Shimmer>
	</View>
)

const shimmerStyle = StyleSheet.create({
	logo: {
		width: 140,
		height: 140,
		marginRight: 30,
		borderRadius: 100,
	},
	title: {
		height: 20,
		width: "70%"
	},
	desc: {
		height: 15,
		marginTop: 10,
		width: "40%",
	},
	statVal: {
		width: 100,
		height: 20,
		marginTop: 15,
	},
	tab: {
		marginRight: 40,
		fontSize: 15,
		height: 20,
		width: 100,
		marginTop: 12,
	},
	viewTab: {
		marginRight: 40,
		fontSize: 15,
		height: 20,
		width: 70,
		position: "absolute",
		right: 0,
		top: 12
	},
	loading: {
		fontSize: 16,
		color: colors.holderColor,
		marginTop: 100,
		textAlign: "center"
	},
	card: {
		width: cardWidth,
		backgroundColor: colors.wht,	
		borderRadius: BORDER_RADIUS,		
		height: 200,
		boxShadow: shadows.material,
		padding: 20
	}
});

const style = StyleSheet.create({
	main: {
		width: festivalWidth,
		borderRightWidth: 1,
		borderColor: colors.borderColor,
	},
	header: {
		width: festivalWidth,
		height: 220,
		borderBottomWidth: 1,
		borderRightWidth: 1,
		borderColor: colors.borderColor,
		backgroundColor: colors.wht,
	},
	headerRow: {
		flexDirection: "row",
		paddingTop: 20,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderColor: colors.borderColor,
	},
	logo: {
		width: 140,
		height: 140,
		marginRight: 30,
		borderRadius: 100,
		overflow: "hidden",
		backgroundColor: colors.vectorBase,
	},
	content: {
		flex: 1,
		height: 150,
		paddingTop: 5,
	},
	title: {
		fontSize: 22,
		color: colors.textBlack,
		fontWeight: "bold",
	},
	seasonText: {
		fontSize: 15,
		marginTop: 5,
		color: colors.holderColor,
		fontWeight: "400",
	},
	statBox: {
		width: "45%",
		paddingTop: 10,
	},
	statRow: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	statVr: {
		height: "90%",
		width: 1,
		alignSelf: "flex-end",
		backgroundColor: colors.borderColor,
	},
	statField: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: 30,
		marginTop: 10,
	},
	statValue: {
		fontWeight: "bold",
		fontSize: 16,
		color: colors.textBlack,
	},
	statTitle: {
		fontSize: 14,
		color: colors.holderColor,
		fontWeight: "400",
	},
	tabCover: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		flex: 1,
		paddingHorizontal: 20,
	},
	tabRight: {
		flexDirection: "row",
	},
	tabText: {
		marginRight: 40,
		fontSize: 15,
		color: colors.textBlack,
		fontWeight: "500",
	},
	viewText: {
		fontSize: 15,
		color: colors.primaryBlue,
		fontWeight: "500",
	},
	cardRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginTop: 20,
		paddingHorizontal: 20,
		justifyContent: "space-between",
	},
	tooltip: {
		fontFamily: "sans-serif",
	},
});

export default FestivalContent;