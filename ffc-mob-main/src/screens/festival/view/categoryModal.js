import React, { useState, useMemo } from 'react';
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
import { H70, W90, W10, BORDER_RADIUS } from 'utils/constants';
import Animated, {
	FadeIn,
	FadeInLeft,
	FadeOutRight,
	SlideInDown,
} from 'react-native-reanimated';

const nobSize = 9;
const nobLeft = -(W10 - nobSize * 2);
const CategoryModal = ({ onClose, festivalFees = [], visible }) => {
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
				category: {
					height: 50,
					paddingHorizontal: 10,
					width: '100%',
					borderBottomWidth: 1,
					borderColor: colors.border,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				},
				categoryName: {
					fontSize: fonts.regular,
					color: colors.holderColor,
				},
				feeCard: {
					width: W90,
					alignSelf: 'center',
					marginTop: 10,
					paddingBottom: 10,
					borderBottomWidth: 1,
					borderColor: colors.border,
				},
				deadline: {
					fontSize: fonts.regular,
					marginBottom: 5,
				},
				fee: {
					fontSize: fonts.small,
					fontWeight: weights.semibold,
				},
				button: {
					marginTop: 10,
					width: '100%',
					height: 35,
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: BORDER_RADIUS,
					backgroundColor: colors.greenDark,
				},
				buttonText: {
					fontSize: fonts.regular,
					fontWeight: weights.semibold,
					color: colors.buttonTxt,
				},
				sideNobCover: {
					position: 'absolute',
					top: 28,
					left: nobLeft,
				},
				nob: {
					width: 0,
					height: 0,
					backgroundColor: 'transparent',
					borderStyle: 'solid',
					borderTopWidth: nobSize,
					borderRightWidth: nobSize,
					borderBottomWidth: nobSize,
					borderLeftWidth: nobSize,
					borderTopColor: 'transparent',
					borderRightColor: 'transparent',
					borderBottomColor: 'transparent',
					borderLeftColor: colors.greenDark,
				},
			}),
		[colors]
	);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleClose = () => {
		setSelectedIndex(0);
		onClose();
	};

	const renderFee = (fee, index) => {
		const color = fee.isCurrent ? colors.greenDark : colors.holderColor;
		const goldColor = fee.isCurrent ? colors.gold : colors.holderColor;
		return (
			<Animated.View
				entering={FadeInLeft}
				exiting={FadeOutRight}
				style={style.feeCard}
				key={fee.id}
			>
				<Text style={[style.deadline, { color }]}>{fee.name}</Text>
				<Text style={[style.fee, { color }]}>
					Standard:{'  '}
					{fee.currencySymbol}
					{fee.standardFee}
				</Text>
				{fee.goldFee ? (
					<Text style={[style.fee, { color: goldColor }]}>
						Gold fee:{'   '}
						{fee.currencySymbol}
						{fee.goldFee}
					</Text>
				) : null}
				{fee.isCurrent ? (
					<Pressable style={style.button}>
						<Text style={style.buttonText}>Submit</Text>
					</Pressable>
				) : null}
				{fee.isCurrent ? (
					<View style={style.sideNobCover}>
						<View style={style.nob} />
					</View>
				) : null}
			</Animated.View>
		);
	};

	const renderCategory = (item, index) => {
		const isSelected = index === selectedIndex;
		const selectedStyle = isSelected
			? { fontWeight: weights.semibold, color: colors.text }
			: {};
		return (
			<View key={item.id}>
				<Pressable
					onPress={() => setSelectedIndex(index)}
					style={style.category}
				>
					<Text style={[style.categoryName, selectedStyle]}>{item.name}</Text>
					<View style={style.downIcon}>
						<FeatherIcon
							name={isSelected ? 'chevron-up' : 'chevron-down'}
							size={20}
							color={colors.holderColor}
						/>
					</View>
				</Pressable>
				{isSelected && item.deadlines?.length
					? item.deadlines.map(renderFee)
					: null}
			</View>
		);
	};
	return (
		<Modal
			animationType="fade"
			style={style}
			visible={visible}
			transparent
			onRequestClose={handleClose}
		>
			<Animated.View style={style.main} entering={FadeIn}>
				<Animated.View style={style.content} entering={SlideInDown}>
					<View style={style.header}>
						<Text style={style.title}>Categories & Fees</Text>
						<Pressable onPress={handleClose} style={style.downIcon}>
							<FeatherIcon name="x" size={20} color={colors.text} />
						</Pressable>
					</View>
					<ScrollView>{festivalFees.map(renderCategory)}</ScrollView>
				</Animated.View>
			</Animated.View>
		</Modal>
	);
};

export default CategoryModal;
