import React, {
	useState,
	forwardRef,
	useRef,
	useImperativeHandle,
} from "react";
import { TextInput, Text } from "react-native";
import colors from "themes/colors";
import {
	BORDER_RADIUS,
	BUTTON_HEIGHT,
	FORM_SM_FONT_SIZE,
} from "utils/constants";

const Input = forwardRef((props, ref) => {
	const inputRef = useRef(null);
	useImperativeHandle(ref, () => ({
		setError,
		focus,
		blur,
	}));
	const [focused, setFocused] = useState(false);
	const [errorText, setErrorText] = useState(null);
	const borderColor = focused ? colors.primaryBlue : colors.borderColor;
	const handleChange = (data) => {
		const { onChangeText } = props || {};
		if (onChangeText) onChangeText(data);
		if (errorText) setErrorText(null);
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
				style={[
					defaultStyle,
					props.style,
					{
						borderColor: errorText ? colors.rubyRed : borderColor,
						opacity: props.disabled ? 0.5 : 1,
					},
				]}
				placeholderTextColor={colors.holderColor}
				onFocus={() => {
					setFocused(true)
					if(props.onFocus){
						props.onFocus();
					}
				}}
				onBlur={() => {
					setFocused(false)
					if(props.onBlur){
						props.onBlur();
					}
				}}
				onChangeText={handleChange}
			/>
			{errorText ? (
				<Text style={style.errorText}>{errorText}</Text>
			) : null}
		</>
	);
});

const defaultStyle = {
	borderRadius: BORDER_RADIUS,
	borderWidth: 1,
	paddingLeft: 10,
	height: BUTTON_HEIGHT,
	fontSize: 18,
	fontWeight: 300,
	outline: "none"	
};

const style = {
	errorText: {
		fontSize: FORM_SM_FONT_SIZE,
		color: colors.rubyRed,
		marginTop: 3,
	},
};

Input.defaultProps = {
	style: {},
};

export default Input;