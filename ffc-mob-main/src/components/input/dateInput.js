import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
	BORDER_RADIUS,
	BUTTON_HEIGHT,
	MMMDDYYYY,
	YYYYMMDD,
} from 'utils/constants';
import FeatherIcon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useTheme } from '@react-navigation/native';

const DateInput = (props) => {
	const [pickerVisible, setPickerVisible] = useState(false);
	const [currentValue, setCurrentValue] = useState(new Date());
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					borderRadius: BORDER_RADIUS,
					borderWidth: 1,
					borderColor: colors.border,
					height: BUTTON_HEIGHT,
					flexDirection: 'row',
					alignItems: 'center',
					paddingHorizontal: 10,
					overflow: 'hidden',
					outline: 'none',
					opacity: props.disabled ? 0.5 : 1,
				},
				inputStyle: {
					fontSize: 18,
					fontWeight: '300',
					paddingLeft: 5,
					width: '85%',
				},
				dateIcon: {
					width: 30,
					height: '100%',
					justifyContent: 'space-around',
					alignItems: 'center',
					flexDirection: 'row',
				},
			}),
		[colors, props?.disabled]
	);

	const showPicker = () => {
		const value = props?.value;
		if (value) {
			const date = moment(value, YYYYMMDD).toDate();
			setCurrentValue(date);
		}
		setPickerVisible(true);
	};

	const selectDate = ({ nativeEvent: { timestamp }, type }) => {
		if (type === 'set' && props.onSelect) {
			const value = moment(timestamp).format(YYYYMMDD);
			props.onSelect(value);
		}
		setPickerVisible(false);
	};

	const textColor = props?.value ? colors.text : colors.holderColor;
	const formattedDate = useMemo(() => {
		return props?.value
			? moment(props?.value, YYYYMMDD).format(MMMDDYYYY)
			: null;
	}, [props?.value]);
	return (
		<TouchableOpacity
			disabled={props.disabled}
			style={[style.main, props.style]}
			onPress={showPicker}
		>
			<Text style={[style.inputStyle, props?.textStyle, { color: textColor }]}>
				{formattedDate || props?.placeholder}
			</Text>
			<View style={style.dateIcon}>
				<FeatherIcon name="calendar" size={17} color={colors.holderColor} />
			</View>
			{pickerVisible ? (
				<DateTimePicker
					onChange={selectDate}
					value={currentValue}
					mode="date"
				/>
			) : null}
		</TouchableOpacity>
	);
};

DateInput.defaultProps = {
	style: {},
	onSelect: () => {},
	inputProps: {},
	textStyle: {},
	value: '',
};

export default DateInput;
