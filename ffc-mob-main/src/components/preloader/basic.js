import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Button from '../button';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
const defaultErrorText =
	'We are unable to proccess your request,\ntry again by clicking on below button';
const defaultEmptyText = 'No Records found!';
const BasicPreloader = ({
	onRetry,
	errorText = defaultErrorText,
	hasError = false,
	isBusy = true,
	isEmpty = false,
	emptyIcon = 'file-text',
	emptyText = defaultEmptyText,
	errorButtonText = 'Retry',
	emptyButtonText = 'Add New',
	onEmptyPress,
	children,
	CustomLoader,
}) => {
	const { colors } = useTheme();
	const style = StyleSheet.create({
		main: {
			width: '100%',
			height: 300,
			justifyContent: 'center',
			alignItems: 'center',
			paddingHorizontal: 10,
		},
		note: {
			marginTop: 10,
			marginBottom: 20,
			fontSize: 15,
			color: colors.holderColor,
			textAlign: 'center',
		},
		button: {
			height: 34,
			width: 100,
		},
		buttonTxt: {
			fontSize: 14,
		},
	});

	if (hasError) {
		return (
			<View style={style.main}>
				<FeatherIcon name={'alert-triangle'} size={65} color={colors.primary} />
				<Text style={style.note}>{errorText}</Text>
				<Button
					type={Button.OUTLINE_PRIMARY}
					onPress={() => {
						onRetry();
					}}
					style={style.button}
					text={errorButtonText}
				/>
			</View>
		);
	} else if (isBusy) {
		if (CustomLoader) {
			return <CustomLoader />;
		}
		return (
			<View style={style.main}>
				<ActivityIndicator size={30} color={colors.primary} />
			</View>
		);
	} else if (isEmpty) {
		return (
			<View style={style.main}>
				<FeatherIcon name={emptyIcon} size={65} color={colors.primary} />
				<Text style={style.note}>{emptyText}</Text>
				{onEmptyPress ? (
					<Button
						type={Button.OUTLINE_PRIMARY}
						onPress={onEmptyPress}
						textStyle={style.buttonTxt}
						style={style.button}
						text={emptyButtonText}
					/>
				) : null}
			</View>
		);
	}
	return children || null;
};

export default BasicPreloader;