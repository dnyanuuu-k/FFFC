import React, { useMemo } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Cover } from './shared';

import { useTheme } from '@react-navigation/native';
import { fonts } from 'themes/topography';

const ReportTab = () => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				card: {
					height: 50,
					paddingHorizontal: 10,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					borderColor: colors.border,
					borderBottomWidth: 1,
				},
				desc: {
					fontSize: fonts.small,
					color: colors.holderColor,
				},
				option: {
					fontSize: fonts.small,
					fontWeight: colors.semibold,
					color: colors.text,
				},
			}),
		[colors]
	);
	return (
		<Cover>
			<Pressable style={style.card}>
				<View>
					<Text style={style.option}>Payment Report</Text>
					<Text style={style.desc}>Generate payment reports</Text>
				</View>
				<FeatherIcon color={colors.text} size={15} name="chevron-right" />
			</Pressable>
			<Pressable style={style.card}>
				<View>
					<Text style={style.option}>Settlement Report</Text>
					<Text style={style.desc}>Download settlement reports</Text>
				</View>
				<FeatherIcon color={colors.text} size={15} name="chevron-right" />
			</Pressable>
			<Pressable style={[style.card, { borderBottomWidth: 0 }]}>
				<View>
					<Text style={style.option}>Submission Reports</Text>
					<Text style={style.desc}>Download detailed submission report</Text>
				</View>
				<FeatherIcon color={colors.text} size={15} name="chevron-right" />
			</Pressable>
		</Cover>
	);
};

export default ReportTab;
