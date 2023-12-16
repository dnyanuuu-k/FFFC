import React, { useState, useMemo } from 'react';
// Components
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import DropdownSearchable from '../dropdown/searchable';

// Constants
import { BORDER_RADIUS, BUTTON_HEIGHT } from 'utils/constants';

// Hooks
import { useTheme } from '@react-navigation/native';

const MultiOptionInput = (props) => {
	const { values, label, emptyText } = props;
	const { colors } = useTheme();
	const [pickerVisible, setPickerVisible] = useState(false);
	const textColor = values?.length ? colors.text : colors.holderColor;
	const opacity = props.disabled ? 0.5 : 1;
	const style = useMemo(
		() =>
			StyleSheet.create({
				input: {
					borderRadius: BORDER_RADIUS,
					borderWidth: 1,
					paddingLeft: 10,
					height: BUTTON_HEIGHT,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					borderColor: colors.border,
					opacity,
				},
				countryName: {
					fontSize: 18,
					fontWeight: '300',
					color: textColor,
					width: '70%',
				},
				country: {
					width: 40,
					justifyContent: 'center',
					alignItems: 'center',
				},
			}),
		[colors, textColor, opacity]
	);

	const inputValue = useMemo(() => {
		const count = props.values?.length || 0;
		if (count === 0) {
			return emptyText || `No ${label} Selected`;
		}
		return `${count} ${label}${count > 1 ? 's' : ''} Selected`;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [values, label, emptyText]);

	const showPicker = () => {
		setPickerVisible(true);
	};

	const handleSelect = (v) => {
		setPickerVisible(false);
		if (props.onSelect) {
			props.onSelect(v);
		}
	};

	return (
		<>
			<TouchableOpacity onPress={showPicker} style={[style.input, props.style]}>
				<Text numberOfLines={2} style={[style.countryName, props.textStyle]}>
					{inputValue}
				</Text>
				<View style={style.country}>
					<FeatherIcon
						name="chevron-down"
						size={17}
						color={colors.holderColor}
					/>
				</View>
			</TouchableOpacity>
			{pickerVisible ? (
				<DropdownSearchable
					onSelect={handleSelect}
					selectedValues={props.values}
					onClose={() => setPickerVisible(false)}
					dataList={props.dataList}
					placeholder={props.searchPlaceholder}
					getCodeItem={props.getCodeItem}
				/>
			) : null}
		</>
	);
};

MultiOptionInput.defaultProps = {
	style: {},
	textStyle: {},
};

export default MultiOptionInput;
