import React, {
	useState,
	forwardRef,
	useRef,
	useImperativeHandle,
	useMemo,
} from 'react';
// Components
import {
	TextInput,
	Text,
	TouchableOpacity,
	View,
	NativeModules,
	StyleSheet,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

// Constants
import { BORDER_RADIUS, BUTTON_HEIGHT } from 'utils/constants';

// Hooks
import { useTheme } from '@react-navigation/native';

// Functions
import Country from 'libs/country';
import { RNSelectionMenu } from 'libs/Menu';

// Fonts
import { fonts } from 'themes/topography';

const defaultCountry = Country.getCountry('IN');
const PhoneInput = forwardRef((props, ref) => {
	const inputRef = useRef(null);
	useImperativeHandle(ref, () => ({
		setError,
		focus,
		blur,
	}));

	const { colors } = useTheme();
	const [selected, setSelected] = useState(defaultCountry);
	const [focused, setFocused] = useState(false);
	const borderColor = focused ? colors.primary : colors.border;
	const style = useMemo(
		() =>
			StyleSheet.create({
				input: {
					borderColor: borderColor,
					opacity: props.disabled ? 0.5 : 1,
					color: colors.text,
				},
				errorText: {
					fontSize: fonts.small,
					color: colors.rubyRed,
					marginTop: 3,
				},
				country: {
					width: 50,
					height: BUTTON_HEIGHT,
					justifyContent: 'space-around',
					alignItems: 'center',
					flexDirection: 'row',
					outline: 'none',
				},
				inputStyle: {
					fontSize: 18,
					fontWeight: '300',
					paddingLeft: 5,
					flex: 1,
					color: colors.text,
				},
				codeStyle: {
					fontSize: 20,
					marginTop: -4,
					marginRight: 6,
					fontWeight: '300',
				},
			}),
		[colors, borderColor, props.disabled]
	);

	const [errorText, setErrorText] = useState(null);

	const handleChange = (data) => {
		const { onChangeText } = props || {};
		if (onChangeText) {
			onChangeText(data);
		}
		if (errorText) {
			setErrorText(null);
		}
	};
	const setError = (text) => {
		setErrorText(text);
		focus();
	};
	const focus = () => {
		inputRef.current.focus();
	};
	const blur = () => {
		inputRef.current.blur();
	};

	const showPicker = () => {
		try {
			RNSelectionMenu.Show({
				values: Country.countryOptions,
				selectedValues: ['IN'],
				selectionType: 0,
				presentationType: 3,
				enableSearch: true,
				theme: 0,
				title: 'Countries',
				searchPlaceholder: 'Search Country',
				searchTintColor: colors.holderColor,
				onSelection: (value) => {
					const code = value.split(' - ')[1];
					const country = Country.getCountry(code);
					setSelected(country);
					if (props?.onChangeCountry) {
						props?.onChangeCountry(code);
					}
				},
			});
		} catch (err) {
			console.log(err);
			// Ignore
		}
	};
	return (
		<View style={[defaultStyle, props.style, { borderColor }]}>
			<TouchableOpacity onPress={showPicker} style={style.country}>
				<Text style={style.codeStyle}>{selected.flag}</Text>
				<FeatherIcon name="chevron-down" size={17} color={colors.holderColor} />
			</TouchableOpacity>
			<TextInput
				{...props}
				ref={inputRef}
				editable={!props.disabled}
				style={style.inputStyle}
				selectionColor={colors.bgTrans69}
				placeholderTextColor={colors.holderColor}
				onFocus={() => {
					setFocused(true);
					if (props.onFocus) {
						props.onFocus();
					}
				}}
				onBlur={() => {
					setFocused(false);
					if (props.onBlur) {
						props.onBlur();
					}
				}}
				onChangeText={handleChange}
			/>
			{errorText ? <Text style={style.errorText}>{errorText}</Text> : null}
		</View>
	);
});

const defaultStyle = {
	borderRadius: BORDER_RADIUS,
	borderWidth: 1,
	paddingLeft: 10,
	height: BUTTON_HEIGHT,
	flexDirection: 'row',
};

PhoneInput.defaultProps = {
	style: {},
};

export default PhoneInput;