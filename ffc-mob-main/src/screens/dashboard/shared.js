import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Hooks
import { useTheme } from '@react-navigation/native';

// Constants
import { WINDOW_WIDTH } from 'utils/constants';
import { fonts, weights } from 'themes/topography';

export const Cover = ({ children }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					padding: 10,
					width: WINDOW_WIDTH,
					marginTop: 10,
					backgroundColor: colors.card,
				},
				content: {
					borderRadius: 10,
					borderWidth: 1,
					borderColor: colors.border,
					width: '100%',
				},
			}),
		[colors]
	);

	return (
		<View style={style.main}>
			<View style={style.content}>{children}</View>
		</View>
	);
};

export const DataList = ({ data = [], title, type, totalCount }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				header: {
					width: '100%',
					height: 50,
					justifyContent: 'center',
					paddingLeft: 10,
					borderBottomWidth: 1,
					borderColor: colors.border,
				},
				title: {
					color: colors.text,
					fontSize: fonts.regular,
					fontWeight: weights.semibold,
				},
				card: {
					height: 60,
					paddingHorizontal: 10,
					flexDirection: 'row',
					borderBottomWidth: 1,
					alignItems: 'center',
					borderColor: colors.border,
					justifyContent: 'space-between',
				},
				amount: {
					fontSize: fonts.small,
					fontWeight: weights.bold,
					color: colors.text,
				},
				desc: {
					fontSize: fonts.small,
					color: colors.holderColor,
				},
				name: {
					fontSize: fonts.small,
					fontWeight: colors.semibold,
					color: colors.text,
				},
				footer: {
					height: 40,
					justifyContent: 'center',
					alignItems: 'center',
				},
				footerText: {
					color: colors.primary,
				},
				emptyText: {
					height: 60,
					width: '100%',
					textAlign: 'center',
					fontSize: fonts.small,
					color: colors.holderColor,
					textAlignVertical: 'center',
				},
			}),
		[colors]
	);

	const renderRow = (item, index) => {
		return (
			<View style={style.card} key={index}>
				<View>
					<Text style={style.name}>{item.title}</Text>
					{item.desc?.length > 0 ? (
						<Text style={style.desc}>{item.desc}</Text>
					) : null}
				</View>
				<Text style={style.amount}>{item.value}</Text>
			</View>
		);
	};

	return (
		<Cover>
			<View style={style.header}>
				<Text style={style.title}>{title}</Text>
			</View>
			{data.length ? (
				data.map(renderRow)
			) : (
				<Text style={style.emptyText}>No {type} found</Text>
			)}
			{data.length ? (
				<View style={style.footer}>
					<Text style={style.footerText}>
						Manage all {type} ({totalCount})
					</Text>
				</View>
			) : null}
		</Cover>
	);
};

export const StatBox = ({ data = [] }) => {
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
				},
				key: {
					fontSize: fonts.small,
					color: colors.holderColor,
				},
				value: {
					fontSize: fonts.small,
					fontWeight: weights.bold,
					color: colors.text,
				},
			}),
		[colors]
	);

	const renderStat = (item, index) => {
		const isLast = index === data.length - 1;
		const borderWidth = isLast ? 0 : 1;
		return (
			<View
				key={index}
				style={[style.card, { borderBottomWidth: borderWidth }]}
			>
				<Text style={style.key}>{item.label}</Text>
				<Text style={[style.value, { color: item.color }]}>{item.value}</Text>
			</View>
		);
	};

	return <Cover>{data.map(renderStat)}</Cover>;
};