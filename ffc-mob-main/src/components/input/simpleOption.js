import React, { useMemo } from 'react';
// Components
import {
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { RNSelectionMenu } from 'libs/Menu/';

// Constants
import { BORDER_RADIUS, BUTTON_HEIGHT } from 'utils/constants';

// Hooks
import { useTheme } from '@react-navigation/native';

const OptionInput = (props) => {
	const {
		addClear = false,
		selectedValue,
		options,
		onSelect,
		placeholder = '',
	} = props;
	const { colors, dark } = useTheme();
	const selectedOption = useMemo(() => {
		if (options?.length && selectedValue !== undefined) {
			const selected = options.find((o) => o.value === selectedValue);
			return selected;
		}
		return {};
	}, [selectedValue, options]);
	const textColor = selectedOption?.label ? colors.text : colors.holderColor;
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
				label: {
					fontSize: 18,
					fontWeight: '300',
					color: textColor,
				},
				optionBox: {
					width: 40,
					justifyContent: 'center',
					alignItems: 'center',
				},
			}),
		[colors, textColor, opacity]
	);

	const clearSupport = addClear && selectedOption?.label;

	const showPicker = () => {
		const values = options.map((op) => ({ value: op.label }));
		RNSelectionMenu.Show({
			values,
			selectedValues: [''],
			selectionType: 0,
			presentationType: 2,
			theme: dark ? 1 : 0,
			title: props.title,
			onSelection: (label) => {
				const obj = options.find((v) => v.label === label);
				if (onSelect) {
					onSelect(obj.value);
				}
			},
		});
	};

	const clearSelected = () => {
		if (clearSupport) {
			onSelect(null);
			return;
		}
		showPicker();
	};

	return (
		<TouchableOpacity onPress={showPicker} style={[style.input, props.style]}>
			<Text numberOfLines={2} style={[style.label, props.textStyle]}>
				{selectedOption?.label || placeholder}
			</Text>
			<Pressable onPress={clearSelected} style={style.optionBox}>
				<FeatherIcon
					name={clearSupport ? 'x' : 'chevron-down'}
					size={17}
					color={colors.holderColor}
				/>
			</Pressable>
		</TouchableOpacity>
	);
};

OptionInput.defaultProps = {
	style: {},
	textStyle: {},
};

export default OptionInput;