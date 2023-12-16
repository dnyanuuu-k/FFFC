import React, {
	useState,
	forwardRef,
	useRef,
	useImperativeHandle,
} from 'react';
import { TextInput, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { BORDER_RADIUS, BUTTON_HEIGHT } from 'utils/constants';
import { fonts } from 'themes/topography';

const Input = forwardRef((props, ref) => {
	const inputRef = useRef(null);
	useImperativeHandle(ref, () => ({
		setError,
		focus,
		blur,
	}));

	const { colors } = useTheme();
	const [focused, setFocused] = useState(false);
	const borderColor = focused ? colors.primary : colors.border;
	const style = {
		input: {
			borderColor: errorText ? colors.rubyRed : borderColor,
			opacity: props.disabled ? 0.5 : 1,
			color: colors.text,
		},
		errorText: {
			fontSize: fonts.small,
			color: colors.rubyRed,
			marginTop: 3,
		},
	};

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
	return (
		<>
			<TextInput
				{...props}
				ref={inputRef}
				editable={!props.disabled}
				style={[defaultStyle, props.style, style.input]}
				placeholderTextColor={colors.holderColor}
				selectionColor={colors.bgTrans69}
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
		</>
	);
});

const defaultStyle = {
	borderRadius: BORDER_RADIUS,
	borderWidth: 1,
	paddingLeft: 10,
	height: BUTTON_HEIGHT,
	fontSize: 18,
	fontWeight: '300',
};

Input.defaultProps = {
	style: {},
};

export default Input;
