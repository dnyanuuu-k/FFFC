import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import { fonts, weights } from 'themes/topography';

const SubmissionNavigator = ({ onNext, onPrevious }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				footer: {
					backgroundColor: colors.primary,
					elevation: 10,
					position: 'absolute',
					bottom: 0,
					width: '100%',
					flexDirection: 'row',
					justifyContent: 'space-between',
				},
				option: {
					height: 50,
					alignItems: 'center',
					flexDirection: 'row',
				},
				ml: {
					marginLeft: 10,
				},
				mr: {
					marginRight: 10,
				},
				label: {
					fontSize: fonts.small,
					fontWeight: weights.semibold,
					color: colors.buttonTxt,
				},
				vr: {
					width: 0.5,
					height: 50,
					backgroundColor: colors.border,
				},
			}),
		[colors]
	);
	return (
		<View style={style.footer}>
			<Pressable onPress={onPrevious} style={style.option}>
				<FeatherIcon
					style={style.ml}
					color={colors.buttonTxt}
					size={15}
					name="chevron-left"
				/>
				<Text style={[style.label, style.ml]}>Previous Submission</Text>
			</Pressable>
			<View style={style.vr} />
			<Pressable onPress={onNext} style={style.option}>
				<Text style={[style.label, style.mr]}>Next Submission</Text>
				<FeatherIcon
					style={style.mr}
					color={colors.buttonTxt}
					size={15}
					name="chevron-right"
				/>
			</Pressable>
		</View>
	);
};

export default SubmissionNavigator;