import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";

// Custom Components
import Shimmer, { ShimmerView } from "components/shimmer/";
import Preloader from "components/preloader/basic";
import Icon8 from "components/icons/icon8";

// Third-Party Components
import { Scrollbars } from "react-custom-scrollbars";

// Constants
import { FULLBAR_WIDTH } from "utils/constants";
import colors from "themes/colors";

// Helper Functions
import Backend from "backend";

const profileWidth = FULLBAR_WIDTH * 0.35;
const avatarMargin = -75;
const photoSize = (profileWidth * 0.9) / 3.2;

class UserContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: false,
			loading: false,
		};
	}

	componentDidMount() {
		this.loadFestivalHome();
	}

	loadFestivalHome = async () => {
		try {
			this.setState({ loading: true });
			const response = await Backend.Home.UserData();
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

	render() {
		const { error, loading } = this.state;
		return (
			<View style={style.userContent}>
				<Preloader
					onRetry={this.loadFestivalHome}
					hasError={error}
					isBusy={loading}
					isEmpty={false}
					CustomLoader={UserShimmer}
				>
					<Scrollbars autoHide>
						<View>
							<View style={style.header}></View>

							<View style={style.avatar} />

							<Text numberOfLines={1} style={style.title}>
								Anuraj Patil
							</Text>
							<Text numberOfLines={1} style={style.designation}>
								Organizer
							</Text>

							<View style={style.socialRow}>
								<Icon8
									icon={Icon8.fb}
									style={style.socialIcon}
								/>
								<Icon8
									icon={Icon8.linkedin}
									style={style.socialIcon}
								/>
								<Icon8
									icon={Icon8.insta}
									style={style.socialIcon}
								/>
								<Icon8
									icon={Icon8.twitter}
									style={style.socialIcon}
								/>
							</View>

							<View style={style.photoRow}>
								<View style={style.photo} />
								<View style={style.photo} />
								<View style={style.photo} />
								<View style={style.photo} />
								<View style={style.photo} />
								<View style={style.photo} />
							</View>
						</View>
					</Scrollbars>
				</Preloader>
			</View>
		);
	}
}

const UserShimmer = () => {
	return (
		<View style={style.userContent}>
			<Shimmer>
				<View style={style.content}>
					<ShimmerView style={shimmerStyle.header} />

					<ShimmerView style={shimmerStyle.avatar} />

					<ShimmerView style={shimmerStyle.title} />
					<ShimmerView style={shimmerStyle.desc} />

					<View style={style.socialRow}>
						<Icon8 icon={Icon8.fb} style={shimmerStyle.icon} />
						<Icon8
							icon={Icon8.linkedin}
							style={shimmerStyle.icon}
						/>
						<Icon8 icon={Icon8.insta} style={shimmerStyle.icon} />
						<Icon8 icon={Icon8.twitter} style={shimmerStyle.icon} />
					</View>

					<View style={style.photoRow}>
						<ShimmerView style={shimmerStyle.photo} />
						<ShimmerView style={shimmerStyle.photo} />
						<ShimmerView style={shimmerStyle.photo} />
						<ShimmerView style={shimmerStyle.photo} />
						<ShimmerView style={shimmerStyle.photo} />
						<ShimmerView style={shimmerStyle.photo} />
					</View>
				</View>
			</Shimmer>
		</View>
	);
};

const shimmerStyle = StyleSheet.create({
	photo: {
		height: photoSize,
		width: photoSize,
		marginTop: 10,
	},
	header: {
		height: 220,
	},
	avatar: {
		height: 150,
		width: 150,
		borderWidth: 6,
		borderColor: colors.wht,
		borderRadius: 100,
		alignSelf: "center",
		marginTop: avatarMargin,
	},
	title: {
		marginTop: 10,
		height: 24,
		width: "60%",
		alignSelf: "center",
	},
	icon: {
		width: 22,
		height: 22,
		tintColor: colors.holderColor,
	},
	desc: {
		height: 16,
		width: "40%",
		marginTop: 5,
		alignSelf: "center",
	},
});

const style = StyleSheet.create({
	userContent: {
		width: profileWidth,
		backgroundColor: colors.wht,
	},
	header: {
		height: 220,
		backgroundColor: colors.vectorBase,
	},
	title: {
		marginTop: 10,
		textAlign: "center",
		fontWeight: "600",
		fontSize: 24,
		width: "90%",
		alignSelf: "center",
		color: colors.textBlack,
	},
	designation: {
		fontSize: 16,
		fontWeight: "300",
		color: colors.holderColor,
		marginTop: 5,
		textAlign: "center",
	},
	avatar: {
		height: 150,
		width: 150,
		borderWidth: 6,
		borderColor: colors.wht,
		backgroundColor: colors.vectorBase,
		borderRadius: 100,
		alignSelf: "center",
		marginTop: avatarMargin,
	},
	socialRow: {
		flexDirection: "row",
		width: 230,
		alignSelf: "center",
		marginVertical: 30,
		justifyContent: "space-between",
	},
	socialIcon: {
		width: 22,
		height: 22,
		tintColor: colors.textBlack,
	},
	photoRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		width: "90%",
		alignSelf: "center",
		justifyContent: "space-between",
	},
	photo: {
		height: photoSize,
		width: photoSize,
		backgroundColor: colors.vectorBase,
		marginTop: 10,
	},
});

export default UserContent;