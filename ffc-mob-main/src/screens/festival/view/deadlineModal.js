import React, { useMemo } from 'react';
import {
	View,
	Text,
	ScrollView,
	Modal,
	Pressable,
	StyleSheet,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { fonts, weights } from 'themes/topography';
import { useTheme } from '@react-navigation/native';
import { H70, W90 } from 'utils/constants';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

const DeadlineModal = ({ onClose, visible, deadlines = [] }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					flex: 1,
					backgroundColor: colors.bgTrans,
					justifyContent: 'flex-end',
				},
				content: {
					borderTopRightRadius: 10,
					borderTopLeftRadius: 10,
					backgroundColor: colors.card,
					height: H70,
					overflow: 'hidden',
				},
				header: {
					height: 50,
					paddingHorizontal: 10,
					width: '100%',
					elevation: 2,
					backgroundColor: colors.card,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				},
				title: {
					fontSize: fonts.title,
					color: colors.text,
					fontWeight: weights.semibold,
				},
				downIcon: {
					height: 50,
					width: 50,
					justifyContent: 'center',
					alignItems: 'center',
				},

				deadlineCover: {
					flexDirection: 'row',
					width: W90,
					height: 70,
					marginBottom: 10,
					alignSelf: 'center',
					alignItems: 'center',
				},
				dotCover: {
					height: 70,
					alignItems: 'center',
					justifyContent: 'center',
				},
				dot: {
					borderWidth: 2,
					borderRadius: 10,
					width: 10,
					height: 10,
				},
				dotBar: {
					position: 'absolute',
					bottom: -35,
					height: 60,
					marginTop: 2,
					width: 1,
					backgroundColor: colors.border,
				},
				deadlineContent: {
					marginLeft: 10,
				},
				date: {
					fontSize: fonts.small,
					fontWeight: weights.semibold,
				},
				deadlineTitle: {
					fontSize: fonts.regular,
					marginTop: 3,
				},
			}),
		[colors]
	);

	const totalIndex = deadlines.length - 1;

	const renderDeadline = (deadline, index) => {
		let color = colors.holderColor;
		if (deadline.isCurrent) {
			color = colors.greenDark;
		} else if (deadline.isExpired) {
			color = colors.shimmerColor;
		}
		const isLast = index === totalIndex;
		return (
			<View style={style.deadlineCover} key={deadline.id}>
				<View style={style.dotCover}>
					<View style={[style.dot, { borderColor: color }]} />
					{isLast ? null : <View style={style.dotBar} />}
				</View>
				<View style={style.deadlineContent}>
					<Text style={[style.date, { color }]}>{deadline.formattedDate}</Text>
					<Text style={[style.deadlineTitle, { color }]}>{deadline.name}</Text>
				</View>
			</View>
		);
	};

	return (
		<Modal
			animationType="fade"
			style={style}
			visible={visible}
			transparent
			onRequestClose={onClose}
		>
			<Animated.View style={style.main} entering={FadeIn}>
				<Animated.View style={style.content} entering={SlideInDown}>
					<View style={style.header}>
						<Text style={style.title}>Dates & Deadlines</Text>
						<Pressable onPress={onClose} style={style.downIcon}>
							<FeatherIcon name="x" size={20} color={colors.text} />
						</Pressable>
					</View>
					<ScrollView>{deadlines.map(renderDeadline)}</ScrollView>
				</Animated.View>
			</Animated.View>
		</Modal>
	);
};

export default DeadlineModal;
