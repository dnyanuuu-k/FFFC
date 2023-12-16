import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import DraggableBottomSheet from '../modal/draggableBottomSheet';import Button from '../button/';
import { useTheme } from '@react-navigation/native';
import { fonts, weights } from 'themes/topography';
import FeatherIcon from 'react-native-vector-icons/Feather';
const MODAL_HEIGHT = 500;

const SubmissionOverview = ({ visible, data, onClose }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				title: {
					marginTop: 10,
					color: colors.primary,
					fontSize: fonts.regular,
					fontWeight: weights.bold,
				},
				festRow: {
					alignItems: 'center',
					flexDirection: 'row',
					marginTop: 15,
				},
				dataRow: {
					alignItems: 'center',
					flexDirection: 'row',
					marginTop: 15,
					justifyContent: 'space-between',
				},
				festText: {
					color: colors.holderColor,
					fontSize: fonts.small,
					marginLeft: 10,
				},
				hr: {
					width: '100%',
					backgroundColor: colors.border,
					height: 1,
					marginTop: 20,
				},
				dataKey: {
					color: colors.holderColor,
					fontSize: fonts.small,
				},
				dataVal: {
					color: colors.holderColor,
					fontSize: fonts.small,
					fontWeight: weights.bold,
				},
				button: {
					marginTop: 20,
				},
				buttonTxt: {
					fontSize: fonts.regular,
				},
			}),
		[colors]
	);
	return (
		<DraggableBottomSheet
			height={MODAL_HEIGHT}
			colors={colors}
			onClose={onClose}
			visible={visible}
			padding={15}
		>
			<Text style={style.title}>{data.festivalName}</Text>
			<View style={style.festRow}>
				<FeatherIcon size={15} name="map-pin" color={colors.holderColor} />
				<Text style={style.festText}>{data.address}</Text>
			</View>

			<View style={style.festRow}>
				<FeatherIcon size={15} name="mail" color={colors.holderColor} />
				<Text style={style.festText}>{data.email}</Text>
			</View>

			<View style={style.festRow}>
				<FeatherIcon size={15} name="phone" color={colors.holderColor} />
				<Text style={style.festText}>{data.phoneNo}</Text>
			</View>

			<View style={style.hr} />

			<View style={style.dataRow}>
				<Text style={style.dataKey}>Submission Date</Text>
				<Text style={style.dataVal}>{data.submissionDate}</Text>
			</View>

			<View style={style.dataRow}>
				<Text style={style.dataKey}>Notification Date</Text>
				<Text style={style.dataVal}>{data.notificationDate}</Text>
			</View>

			<View style={style.dataRow}>
				<Text style={style.dataKey}>Festival Start Date</Text>
				<Text style={style.dataVal}>{data.festivalStartDate}</Text>
			</View>

			<View style={style.dataRow}>
				<Text style={style.dataKey}>Tracking Number</Text>
				<Text style={style.dataVal}>{data.trackingId}</Text>
			</View>

			<View style={style.hr} />

			<Button
				text="View Reciept"
				style={style.button}
				type={Button.OUTLINE_PRIMARY}
				textStyle={style.buttonTxt}
			/>

			<Button
				text="Withdraw Submission"
				style={style.button}
				type={Button.OUTLINE_DANGER}
				textStyle={style.buttonTxt}
			/>
		</DraggableBottomSheet>
	);
};

export default SubmissionOverview;
