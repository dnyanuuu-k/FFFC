import React, { useMemo, useState, useEffect } from 'react';
import {
	TouchableOpacity,
	View,
	ScrollView,
	Text,
	StyleSheet,
	Modal,
	TextInput,
	Keyboard,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Animated, {
	useSharedValue,
	withTiming,
	Easing,
	useAnimatedStyle,
} from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
// Hooks
import useDebounce from 'hooks/useDebounce';
import { useTheme } from '@react-navigation/native';
import { fonts, weights } from 'themes/topography';
import { W90, WINDOW_HEIGHT } from 'utils/constants';

const contentHeight = WINDOW_HEIGHT * 0.5 - 50;
const animConfig = {
	easing: Easing.inOut(Easing.cubic),
};
const DropdownSearchable = (props) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					justifyContent: 'flex-end',
					alignItems: 'center',
					paddingBottom: 20,
					height: '100%',
					width: '100%',
					position: 'absolute',
				},
				card: {
					height: 50,
					flexDirection: 'row',
					width: W90,
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingHorizontal: 20,
				},
				nameCover: {
					flex: 1,
				},
				name: {
					fontSize: fonts.regular,
					color: colors.text,
					fontWeight: weights.semibold,
				},
				option: {
					width: 25,
					height: 50,
					justifyContent: 'center',
					alignItems: 'center',
				},
				box: {
					width: 20,
					height: 20,
					borderWidth: 2,
					borderColor: colors.primary,
					borderRadius: 5,
					justifyContent: 'center',
					alignItems: 'center',
				},
				selected: {
					width: 12,
					height: 12,
					backgroundColor: colors.primary,
					borderRadius: 3,
				},
				bottomGap: {
					height: 50,
				},
				header: {
					paddingHorizontal: 20,
					height: 40,
					borderBottomWidth: 1,
					borderColor: colors.border,
					flexDirection: 'row',
					alignItems: 'center',
				},
				footer: {
					paddingLeft: 10,
					height: 40,
					borderTopWidth: 1,
					borderColor: colors.border,
				},
				tagCover: {
					height: 40,
					justifyContent: 'center',
				},
				tag: {
					paddingLeft: 10,
					backgroundColor: colors.primaryLight,
					flexDirection: 'row',
					height: 30,
					marginRight: 10,
					alignItems: 'center',
					borderWidth: 1,
					borderRadius: 5,
					borderColor: colors.primary,
				},
				tagName: {
					fontSize: fonts.xsmall,
					fontWeight: weights.semibold,
					color: colors.primary,
				},
				closeIcon: {
					width: 30,
					height: 30,
					justifyContent: 'center',
					alignItems: 'center',
				},
				searchIcon: {
					marginRight: 10,
				},
				input: {
					flex: 1,
					fontSize: fonts.regular,
					color: colors.text,
					padding: 0,
				},
				button: {
					width: '50%',
					justifyContent: 'center',
					alignItems: 'center',
					height: 40,
				},
				optionTxt: {
					fontSize: fonts.small,
					fontWeight: weights.semibold,
					color: colors.primary,
				},
				danger: {
					color: colors.rubyRed,
				},
				border: {
					borderRightWidth: 1,
					borderColor: colors.border,
				},
			}),
		[colors]
	);
	const translateY = useSharedValue(contentHeight);
	const opacity = useSharedValue(0);
	const backgroundStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
			width: '100%',
			height: '100%',
			backgroundColor: colors.bgTrans,
		};
	});

	const contentStyle = useAnimatedStyle(() => {
		return {
			backgroundColor: colors.card,
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: 6,
			height: contentHeight,
			width: W90,
			transform: [{ translateY: translateY.value }],
		};
	});

	const bottomStyle = useAnimatedStyle(() => {
		return {
			width: W90,
			height: 40,
			marginBottom: 10,
			flexDirection: 'row',
			marginTop: 10,
			borderWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.card,
			borderRadius: 7,
			transform: [{ translateY: translateY.value }],
		};
	});

	const [visible, setVisible] = useState(true);
	const [currentList, setCurrentList] = useState(props.dataList || []);
	const [selectedList, setSelectedList] = useState([]);
	const [selectedSet, setSelected] = useState(new Map());
	const [refresh, setRefresh] = useState(false);
	const [searchText, setSearchText] = useState('');
	const debounceSearchText = useDebounce(searchText);

	const setCountry = (code, name) => {
		const index = selectedList.length;
		if (selectedSet.has(code)) {
			const currIndex = selectedSet.get(code);
			selectedList.splice(currIndex, 1);
			selectedSet.delete(code);
		} else {
			selectedSet.set(code, index);
			selectedList.push({ name, code });
		}
		setSelected(selectedSet);
		setSelectedList(selectedList);
		setRefresh(!refresh);
	};

	const delCountry = (code) => {
		const currIndex = selectedSet.get(code);
		selectedList.splice(currIndex, 1);
		selectedSet.delete(code);
		selectedSet.delete(code);
		setSelected(selectedSet);
		setSelectedList(selectedList);
		setRefresh(!refresh);
	};

	const close = () => {
		setVisible(false);
		if (props.onClose) {
			props.onClose();
		}
	};

	const submit = () => {
		if (props.onSelect) {
			setVisible(false);
			const list = selectedList.map(({ code }) => code);
			props.onSelect(list);
		} else {
			close();
		}
	};

	const dispatchSelected = () => {
		const { selectedValues, getCodeItem } = props;
		if (selectedValues && selectedValues?.length > 0) {
			let index = 0;
			let list = [];
			let map = new Map();
			for (const code of selectedValues) {
				const country = getCodeItem(code);
				if (country) {
					map.set(code, index);
					list.push({ name: country.name, code });
					index += 1;
				}
			}
			if (list.length > 0) {
				setSelectedList(list);
				setSelected(map);
				setRefresh(!refresh);
			}
		}
	};

	useEffect(() => {
		if (debounceSearchText !== null) {
			if (debounceSearchText.length === 0) {
				setCurrentList(props.dataList);
			} else {
				const lowered = debounceSearchText.toLowerCase();
				const filteredList = props.dataList.filter(({ name }) =>
					name.toLowerCase().includes(lowered)
				);
				setCurrentList(filteredList);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debounceSearchText]);

	useEffect(() => {
		translateY.value = withTiming(0, animConfig);
		opacity.value = withTiming(1);
		const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
			translateY.value = withTiming(-e.endCoordinates.height, animConfig);
		});
		const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
			translateY.value = withTiming(0, animConfig);
		});

		setTimeout(() => {
			dispatchSelected();
		}, 300);
		return () => {
			showSubscription.remove();
			hideSubscription.remove();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const renderCountry = ({ item }) => {
		const selected = selectedSet.has(item.code);
		return (
			<TouchableOpacity
				onPress={() => setCountry(item.code, item.name)}
				style={style.card}
				activeOpacity={0.6}
			>
				<View style={style.nameCover}>
					<Text style={style.name}>{item.name}</Text>
				</View>
				<View style={style.option}>
					<View style={style.box}>
						{selected ? <View style={style.selected} /> : null}
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	const renderTag = ({ name, code }) => (
		<TouchableOpacity
			onPress={() => delCountry(code)}
			activeOpacity={0.6}
			style={style.tagCover}
			key={code}
		>
			<View style={style.tag} key={code}>
				<Text style={style.tagName}>{name}</Text>
				<View style={style.closeIcon}>
					<FeatherIcon name="x" color={colors.primary} size={15} />
				</View>
			</View>
		</TouchableOpacity>
	);

	return (
		<Modal
			statusBarTranslucent
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={close}
		>
			<Animated.View style={backgroundStyle} />
			<View style={style.main}>
				<Animated.View style={contentStyle}>
					<View style={style.header}>
						<View style={style.searchIcon}>
							<FeatherIcon name="search" color={colors.holderColor} size={20} />
						</View>
						<TextInput
							style={style.input}
							placeholder={props.placeholder}
							placeholderTextColor={colors.holderColor}
							value={searchText}
							onChangeText={setSearchText}
							selectionColor={colors.bgTrans69}
						/>
					</View>
					<FlashList
						data={currentList}
						renderItem={renderCountry}
						estimatedItemSize={50}
						extraData={refresh}
						ListFooterComponent={<View style={style.bottomGap} />}
					/>
					<View style={style.footer}>
						<ScrollView showsHorizontalScrollIndicator={false} horizontal>
							{selectedList.map(renderTag)}
						</ScrollView>
					</View>
				</Animated.View>

				<Animated.View style={bottomStyle}>
					<TouchableOpacity
						onPress={close}
						style={[style.button, style.border]}
					>
						<Text style={[style.optionTxt, style.danger]}>Cancel</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={submit} style={style.button}>
						<Text style={style.optionTxt}>Submit</Text>
					</TouchableOpacity>
				</Animated.View>
			</View>
		</Modal>
	);
};

export default DropdownSearchable;