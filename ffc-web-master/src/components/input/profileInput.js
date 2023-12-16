import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

// Custom Components
import Input from "./index";

// Constants
import { BUTTON_FORM_HEIGHT, TOP_GAP10, ERROR_TEXT, XRT } from "utils/constants";
import colors from "themes/colors";

// Helper functions
import Backend from "backend";

// Third-Party Components
import FeatherIcon from "feather-icons-react";

//Third-Party Functions
import aes from "crypto-js/aes";

export default class ProfileInput extends Component {
	static NONE = 0;
	static VALIDATING = 1;
	static VALIDATED = 2;
	static INVALID = 3;
	static FAILED = 4;
	constructor(props) {
		super(props);
		this.state = {
			profileId: '',
			focused: false,
			state: ProfileInput.NONE,
		};
		this.currentTimeout = null;
	}

	setProfileId = (profileId) => {
		this.handleChangeText(profileId);
	}

	handleChangeText = (profileId) => {
		const profileIdInt = Number(profileId);		
		if(!Number.isNaN(profileIdInt)){
			clearTimeout(this.currentTimeout);
			this.setState({ profileId });
			this.currentTimeout = setTimeout(() => {
				this.loadProfileData(profileId);
			}, 700);
		}		
	};

	loadProfileData = async (profileId) => {
		try {
			this.setState({ state: ProfileInput.VALIDATING });
			const encrypted = aes.encrypt(profileId, XRT).toString();
			const response = await Backend.Account.profileBasicData({
				profileId: encrypted
			});
			if(response.success){
				this.setState({
					state: ProfileInput.VALIDATED
				}, () => {
					this.props.onProfileData({
						...response.data,
						id: profileId
					});
				});
			}else if(response.success === false){
				this.setState({
					state: ProfileInput.INVALID
				});
			}else{
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			console.log(err)
			this.setState({
				state: ProfileInput.FAILED
			});
		}
	}

	clearProfile = () => {
		this.setState({
			state: ProfileInput.NONE,
			profileId: ''
		}, () => {
			this.props.onProfileData(null);
		});
	}

	renderState = (state) => {
		switch (state) {
			case ProfileInput.VALIDATING:
				return (
					<ActivityIndicator color={colors.primaryBlue} size={18} />
				);
			case ProfileInput.VALIDATED:
				return (
					<FeatherIcon
						size={20}
						color={colors.greenDark}
						icon="user-check"
					/>
				);
			case ProfileInput.INVALID:
				return (
					<FeatherIcon
						size={20}
						color={colors.rubyRed}
						icon="user-x"
					/>
				);
			case ProfileInput.FAILED:
				return (
					<FeatherIcon
						size={20}
						color={colors.rubyRed}
						icon="refresh-cw"
					/>
				);
			default:
				return null;
		}
	};
	render() {
		const { focused, profileId, state } = this.state;
		const { inputStyle } = this.props;
		const borderColor = focused ? colors.primaryBlue : colors.borderColor;
		return (
			<View style={style.main}>
				<Input
					style={inputStyle}
					value={profileId}
					onFocus={() => this.setState({ focused: true })}
					onBlur={() => this.setState({ focused: false })}
					placeholder="Profile ID"
					onChangeText={this.handleChangeText}
				/>
				{state !== ProfileInput.NONE ? (
					<View style={style.options}>
						<TouchableOpacity onPress={this.clearProfile} style={[style.option, style.border, { borderColor }]}>
							<FeatherIcon
								size={23}
								color={colors.holderColor}
								icon="x"
							/>
						</TouchableOpacity>
						<TouchableOpacity style={style.option}>
							{this.renderState(state)}
						</TouchableOpacity>
					</View>
				) : null}
			</View>
		);
	}
}

const style = StyleSheet.create({
	main: {
		width: "100%",
	},
	border: {
		borderRightWidth: 1,
		borderLeftWidth: 1
	},
	option: {
		height: BUTTON_FORM_HEIGHT,
		width: 45,		
		justifyContent: "center",
		alignItems: "center",		
	},
	options: {
		marginTop: TOP_GAP10,
		position: "absolute",
		right: 0,
		flexDirection: "row",
	},
});