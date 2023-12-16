import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';

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
			height: 180,
			alignSelf: 'center',
			marginTop: 10,
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
		row: { flexDirection: 'row' },
	});
	return (
		<Pressable onPress={onPress} style={[style.card, { width }]}>
			<View style={style.header}>
				<Text style={style.trackingId}>{data.trackingId}</Text>
				<Text style={style.title} numberOfLines={1}>
					{data.festivalName}
				</Text>
				<View style={style.statRow}>
					<Stat
						style={style}
						title={'Project'}
						value={data.projectTitle}
						width={'100%'}
					/>
					<Stat
						style={style}
						title={'Notification Date'}
						value={data.notificationDate}
					/>
				</View>
			</View>
			<View style={style.footer}>
				<View
					style={{
						alignItems: 'center',
						paddingRight: 5,
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
							fontWeight: '500',
							color: colors.greenDark,
						}}
					>
						In Consideration
					</Text>
				</View>

				<View
					style={{
						alignItems: 'center',
						height: 25,
						flexDirection: 'row',
						backgroundColor: colors.border,
						borderRadius: 3,
						paddingRight: 5,
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
				</View>
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