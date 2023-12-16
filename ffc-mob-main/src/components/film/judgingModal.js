import React, { useMemo } from 'react';
import {
	View,
	Text,
	ScrollView,
	Pressable,
	Image,
	StyleSheet,
	Modal,
	ActivityIndicator,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import Animated, {
	FadeIn,
	FadeOut,
	SlideInDown,
	SlideOutDown,
} from 'react-native-reanimated';
import { fonts, weights } from 'themes/topography';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'utils/constants';
const MODAL_HEIGHT = WINDOW_HEIGHT * 0.6;
const PressableAnimated = Animated.createAnimatedComponent(Pressable);
const JudgingModal = ({
	options,
	onClose,
	disabled,
	visible,
	onSelect,
	selectedId,
}) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				content: {
					borderTopLeftRadius: 10,
					borderTopRightRadius: 10,
					paddingHorizontal: 10,
					height: MODAL_HEIGHT,
					backgroundColor: colors.card,
					overflow: 'hidden',
				},
				main: {
					height: WINDOW_HEIGHT,
					width: WINDOW_WIDTH,
					justifyContent: 'flex-end',
					backgroundColor: colors.bgTrans69,
				},
				title: {
					fontSize: fonts.regular,
					color: colors.primary,
					marginBottom: 20,
					marginTop: 14,
					fontWeight: weights.bold,
				},
				item: {
					borderBottomWidth: 1,
					borderColor: colors.border,
					height: 36,
					paddingBottom: 15,
					marginBottom: 20,
					alignItems: 'center',
					flexDirection: 'row',
				},
				icon: {
					width: 25,
					height: 25,
				},
				label: {
					fontSize: fonts.regular,
					color: colors.text,
					flex: 1,
					marginLeft: 10,
					fontWeight: weights.semibold,
				},
				selected: {
					width: 30,
					height: 30,
					justifyContent: 'center',
					alignItems: 'center',
				},
				disabled: {
					width: WINDOW_WIDTH,
					height: '100%',
					position: 'absolute',
					backgroundColor: colors.bgTrans,
					justifyContent: 'center',
					alignItems: 'center',
				},
			}),
		[colors]
	);

	const renderOption = (item, index) => {
		const isSelected = item.id === selectedId;
		return (
			<Pressable
				key={item.id}
				onPress={() => onSelect(item)}
				style={style.item}
			>
				<Image
					source={item.icon}
					style={[style.icon, { tintColor: item.color }]}
				/>

				<Text style={style.label}>{item.label}</Text>
				<View style={style.selected}>
					{isSelected ? (
						<FeatherIcon name="check" color={colors.primary} size={20} />
					) : null}
				</View>
			</Pressable>
		);
	};

	return (
		<Modal
			transparent
			onRequestClose={onClose}
			visible={visible}
			animationType="fade"
			statusBarTranslucent
		>
			<PressableAnimated
				onPress={onClose}
				entering={FadeIn}
				exiting={FadeOut}
				style={style.main}
			>
				<PressableAnimated
					entering={SlideInDown}
					exiting={SlideOutDown}
					style={style.content}
				>
					<Text style={style.title}>Select Judging Status</Text>
					<ScrollView>{options.map(renderOption)}</ScrollView>
					{disabled ? (
						<View style={style.disabled}>
							<ActivityIndicator color={colors.buttonTxt} size={30} />
						</View>
					) : null}
				</PressableAnimated>
			</PressableAnimated>
		</Modal>
	);
};

export default JudgingModal;