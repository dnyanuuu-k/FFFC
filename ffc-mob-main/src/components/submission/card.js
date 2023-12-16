import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

// Third-Party Components
import FeatherIcon from 'react-native-vector-icons/Feather';

// Constants
import { BORDER_RADIUS } from 'utils/constants';

// Hooks
import { useTheme } from '@react-navigation/native';

const SubmissionCard = ({ data, width, onPress }) => {
	const { colors } = useTheme();
	const style = StyleSheet.create({
		card: {
			backgroundColor: colors.card,
			borderRadius: BORDER_RADIUS,
			height: 220,
			alignSelf: 'center',
			marginTop: 14,
			elevation: 1,
		},
		header: {
			padding: 10,
			flex: 1,
		},
		footer: {
			height: 50,
			borderTopWidth: 1,
			alignItems: 'center',
			justifyContent: 'space-between',
			paddingHorizontal: 10,
			borderColor: colors.border,
			flexDirection: 'row',
		},
		trackingId: {
			color: colors.buttonTxt,
			backgroundColor: colors.primary,
			paddingHorizontal: 5,
			paddingVertical: 3,
			alignSelf: 'flex-start',
			borderRadius: 2,
			marginBottom: 5,
			fontWeight: '500',
			fontSize: 12,
		},
		title: {
			color: colors.text,
			fontWeight: '600',
			fontSize: 16,
			width: '95%',
			marginBottom: 5,
			marginTop: 3,
		},
		stat: {
			flexDirection: 'row',
			marginTop: 10,
			alignItems: 'center',
		},
		statRow: {
			flexDirection: 'row',
			flexWrap: 'wrap',
		},
		statKey: {
			fontSize: 12,
			color: colors.holderColor,
			fontWeight: '500',
		},
		statVal: {
			fontSize: 12,
			color: colors.text,
			fontWeight: '500',
		},
		assignButton: {
			width: 30,
			height: 30,
			backgroundColor: colors.primaryLight,
			position: 'absolute',
			top: 5,
			right: 5,
			borderRadius: 60,
			justifyContent: 'center',
			alignItems: 'center',
		},
		row: { flexDirection: 'row' },
	});
	return (
		<Pressable onPress={onPress} style={[style.card, { width }]}>
			<View style={style.header}>
				<Text style={style.trackingId}>{data.trackingId}</Text>
				<Text style={style.title} numberOfLines={1}>
					{data.title}
				</Text>
				<View style={style.statRow}>
					<Stat
						style={style}
						title={'Director'}
						value={data.director}
						width={'100%'}
					/>

					<Stat style={style} title={'Category'} value={data.category} />

					<Stat
						style={style}
						title={'Runtime'}
						value={data.runtime}
						align="flex-end"
					/>

					<Stat style={style} title={'Origin'} value={data.origin} />

					<Stat
						style={style}
						title={'Date'}
						value={data.date}
						align="flex-end"
					/>
				</View>
			</View>
			<View style={style.footer}>
				<View style={style.row}>
					<View
						style={{
							alignItems: 'center',
							marginRight: 10,
							height: 25,
							flexDirection: 'row',
							backgroundColor: colors.rubyRedLight,
							borderRadius: 3,
						}}
					>
						<View
							style={{
								marginHorizontal: 5,
								width: 12,
								height: 12,
								backgroundColor: colors.notification,
								borderRadius: 30,
							}}
						/>
						<FeatherIcon
							color={colors.notification}
							size={15}
							name="chevron-down"
							style={{ marginLeft: 5, marginRight: 5 }}
						/>
					</View>

					<View
						style={{
							alignItems: 'center',
							width: 100,
							marginRight: 10,
							height: 25,
							flexDirection: 'row',
							backgroundColor: colors.greenLight,
							borderRadius: 3,
						}}
					>
						<View
							style={{
								marginHorizontal: 5,
								width: 12,
								height: 12,
								backgroundColor: colors.greenDark,
								borderRadius: 30,
							}}
						/>
						<Text
							numberOfLines={1}
							style={{
								fontSize: 12,
								width: 50,
								fontWeight: '500',
								color: colors.greenDark,
							}}
						>
							Green
						</Text>
						<FeatherIcon
							color={colors.green}
							size={15}
							name="chevron-down"
							style={{ marginLeft: 5, marginRight: 5 }}
						/>
					</View>
				</View>

				<View
					style={{
						alignItems: 'center',
						height: 25,
						flexDirection: 'row',
						backgroundColor: colors.border,
						borderRadius: 3,
					}}
				>
					<View
						style={{
							marginHorizontal: 5,
							width: 12,
							height: 12,
							backgroundColor: colors.holderColor,
							borderRadius: 30,
						}}
					/>
					<Text
						style={{
							fontSize: 12,
							fontWeight: '500',
							color: colors.holderColor,
						}}
					>
						Undecided
					</Text>

					<FeatherIcon
						color={colors.holderColor}
						size={15}
						name="chevron-down"
						style={{ marginLeft: 5, marginRight: 5 }}
					/>
				</View>
			</View>

			<View style={style.assignButton}>
				<FeatherIcon color={colors.primary} size={14} name="user-plus" />
			</View>
		</Pressable>
	);
};

const Stat = ({ title, value, width = '50%', align = 'flex-start', style }) => (
	<View style={[style.stat, { width, justifyContent: align }]}>
		<Text style={style.statKey}>{title} : </Text>
		<Text style={style.statVal}>{value}</Text>
	</View>
);

export default SubmissionCard;
