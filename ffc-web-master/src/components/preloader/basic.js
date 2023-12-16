import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import Button from "../button";
import FeatherIcon from "feather-icons-react";
import colors from "themes/colors";
const defaultErrorText =
	"We are unable to proccess your request,\ntry again by clicking on below button";
const defaultEmptyText = "No Records found!";
const BasicPreloader = ({
	onRetry,
	errorText = defaultErrorText,
	hasError = false,
	isBusy = true,
	isEmpty = false,
	emptyIcon = 'file-text',
	emptyText = defaultEmptyText,
	errorButtonText = "Retry",
	emptyButtonText = "Add New",
	onEmptyPress,
	children,
	CustomLoader
}) => {
	if (hasError) {
		return (
			<View style={style.main}>
				<FeatherIcon
					icon={"alert-triangle"}
					size={70}
					strokeWidth={1}
					color={colors.primaryBlue}
				/>
				<Text style={style.note}>{errorText}</Text>
				<Button
					type={Button.OUTLINE_PRIMARY}
					onPress={onRetry}
					style={style.button}
					text={errorButtonText}
				/>
			</View>
		);
	} else if (isBusy) {
		if(CustomLoader) return (<CustomLoader />)
		return (
			<View style={style.main}>
				<ActivityIndicator size={30} color={colors.primaryBlue} />
			</View>
		);
	} else if (isEmpty) {
		return (
			<View style={style.main}>
				<FeatherIcon
					icon={emptyIcon}
					size={70}
					strokeWidth={1}
					color={colors.primaryBlue}
				/>
				<Text style={style.note}>{emptyText}</Text>
				<Button
					type={Button.OUTLINE_PRIMARY}
					onPress={onEmptyPress}
					textStyle={style.buttonTxt}
					style={style.button}
					text={emptyButtonText}
				/>
			</View>
		);
	}
	return children || null;
};

const style = StyleSheet.create({
	main: {
		width: "100%",
		height: 300,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 10
	},
	note: {
		marginVertical: 20,
		fontSize: 15,
		color: colors.holderColor,
		textAlign: 'center'
	},
	button: {
		height: 30,
		width: 150
	},
	buttonTxt: {
		fontSize: 14
	}
});

export default BasicPreloader;