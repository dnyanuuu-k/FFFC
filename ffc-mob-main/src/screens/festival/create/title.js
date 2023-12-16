import React, { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import toast from 'libs/toast';

const Title = ({
	text,
	required = false,
	marginTop,
	whatIsThis = null,
	extraTopMargin = false,
}) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				fieldTitle: {
					color: colors.text,
					fontWeight: 500,
					marginTop: 20,
					fontSize: 15,
				},
				required: {
					color: colors.rubyRed,
				},
				note: {
					color: colors.primary,
					marginLeft: 10,
					fontSize: 12,
					fontWeight: 400,
				},
			}),
		[colors]
	);
	const extraStyle = extraTopMargin ? { marginTop: 40 } : {};
	const showTooltip = () => {
		if (typeof whatIsThis === 'string') {
			toast.notify(whatIsThis);
		}
	};
	return (
		<Text style={[{ marginTop }, style.fieldTitle, extraStyle]}>
			{text}
			{required ? <Text style={style.required}>*</Text> : null}
			{whatIsThis ? (
				<Text onPress={showTooltip} style={style.note}>
					{'  '}What is this?
				</Text>
			) : null}
		</Text>
	);
};

export default Title;
