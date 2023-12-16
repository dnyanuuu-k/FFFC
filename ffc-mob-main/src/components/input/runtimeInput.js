import React, { useMemo, useState } from 'react';
// Components
import { StyleSheet, Modal, Text, TouchableOpacity, View } from 'react-native';
import WheelPicker from '@gregfrench/react-native-wheel-picker';

// Constants
import { BORDER_RADIUS, BUTTON_HEIGHT, W90 } from 'utils/constants';

// Hooks
import { useTheme } from '@react-navigation/native';

// Topography
import { fonts, weights } from 'themes/topography';

const wheelWidth = W90 / 3.5;
const runtimeHours = [
	'00',
	'01',
	'02',
	'03',
	'04',
	'05',
	'06',
	'07',
	'08',
	'09',
	'10',
];
const runtimeOptions = [
	'00',
	'01',
	'02',
	'03',
	'04',
	'05',
	'06',
	'07',
	'08',
	'09',
	'10',
	'11',
	'12',
	'13',
	'14',
	'15',
	'16',
	'17',
	'18',
	'19',
	'20',
	'21',
	'22',
	'23',
	'24',
	'25',
	'26',
	'27',
	'28',
	'29',
	'30',
	'31',
	'32',
	'33',
	'34',
	'35',
	'36',
	'37',
	'38',
	'39',
	'40',
	'41',
	'42',
	'43',
	'44',
	'45',
	'46',
	'47',
	'48',
	'49',
	'50',
	'51',
	'52',
	'53',
	'54',
	'55',
	'56',
	'57',
	'58',
	'59',
	'60',
];
const padNum = (n) => {
	return n.toString().padStart(2, '0');
};

const RuntimeInput = (props) => {
	const { runtimeSeconds, onSelect } = props;
	const { colors } = useTheme();
	const textColor = runtimeSeconds ? colors.text : colors.holderColor;
	const opacity = props.disabled ? 0.5 : 1;
	const style = useMemo(
		() =>
			StyleSheet.create({
				input: {
					borderRadius: BORDER_RADIUS,
					borderWidth: 1,
					paddingLeft: 10,
					height: BUTTON_HEIGHT,
					justifyContent: 'center',
					borderColor: colors.border,
					opacity,
				},
				label: {
					fontSize: 18,
					fontWeight: '300',
					color: textColor,
					width: '70%',
				},
			}),
		[colors, textColor, opacity]
	);
	const [pickerVisible, setPickerVisible] = useState(false);
	const currentRuntime = useMemo(() => {
		if (runtimeSeconds > 0) {
			const hours = Math.floor(runtimeSeconds / 3600);
			const minutes = Math.floor((runtimeSeconds % 3600) / 60);
			const seconds = runtimeSeconds % 60;
			let runtime = '';
			if (hours) {
				runtime += `${padNum(hours)} Hrs`;
			}
			if (minutes) {
				runtime += ` ${padNum(minutes)} Mins`;
			}
			if (seconds) {
				runtime += ` ${padNum(seconds)} Secs`;
			}
			return [runtime, [hours, minutes, seconds]];
		}
		return ['', [0, 0, 0]];
	}, [runtimeSeconds]);

	const loadWheel = () => {
		setPickerVisible(true);
	};

	const handleSubmit = (totalSeconds) => {
		setPickerVisible(false);
		if (onSelect) {
			onSelect(totalSeconds);
		}
	};

	return (
		<>
			<TouchableOpacity onPress={loadWheel} style={[style.input, props.style]}>
				<Text numberOfLines={2} style={[style.label, props.textStyle]}>
					{currentRuntime[0] || '00:00:00'}
				</Text>
			</TouchableOpacity>
			{pickerVisible ? (
				<RuntimeWheel
					runtimeArray={currentRuntime[1]}
					onSubmit={handleSubmit}
					onClose={() => setPickerVisible(false)}
				/>
			) : null}
		</>
	);
};

const RuntimeWheel = ({ runtimeArray, onSubmit, onClose }) => {
	const [hr, setHr] = useState(runtimeArray[0]);
	const [min, setMin] = useState(runtimeArray[1]);
	const [sec, setSec] = useState(runtimeArray[2]);
	const { colors } = useTheme();
	const style = StyleSheet.create({
		main: {
			justifyContent: 'flex-end',
			paddingBottom: 70,
			alignItems: 'center',
			flex: 1,
			backgroundColor: colors.bgTrans,
		},
		content: {
			width: W90,
			borderRadius: BORDER_RADIUS,
			backgroundColor: colors.card,
			height: 265,
		},
		row: {
			flexDirection: 'row',
			justifyContent: 'center',
			paddingVertical: 20,
			paddingHorizontal: 20,
		},
		wheelCover: {
			width: wheelWidth,
			height: '100%',
		},
		picker: {
			width: wheelWidth,
			height: 150,
		},
		title: {
			fontSize: fonts.regular,
			fontWeight: weights.semibold,
			color: colors.text,
			marginBottom: 10,
			textAlign: 'center',
		},
		button: {
			height: BUTTON_HEIGHT,
			borderTopWidth: 1,
			borderColor: colors.border,
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
		},
		buttonText: {
			fontSize: fonts.small,
			fontWeight: weights.semibold,
			color: colors.primary,
		},
		itemText: {
			color: colors.text,
			fontSize: fonts.title,
		},
	});

	const submit = () => {
		let seconds = sec;
		seconds += hr * 3600;
		seconds += min * 60;
		if (onSubmit) {
			onSubmit(seconds);
		}
	};

	const renderOption = (value, i) => (
		<WheelPicker.Item label={value} value={i} key={i} />
	);

	return (
		<Modal transparent animationType="fade" onRequestClose={onClose}>
			<TouchableOpacity activeOpacity={1} onPress={onClose} style={style.main}>
				<TouchableOpacity activeOpacity={1} style={style.content}>
					<View style={style.row}>
						<View style={style.wheelCover}>
							<Text style={style.title}>Hours</Text>
							<WheelPicker
								style={style.picker}
								selectedValue={hr}
								lineColor={colors.text}
								onValueChange={(x) => setHr(x)}
								itemStyle={style.itemText}
							>
								{runtimeHours.map(renderOption)}
							</WheelPicker>
						</View>
						<View style={style.wheelCover}>
							<Text style={style.title}>Mins</Text>
							<WheelPicker
								style={style.picker}
								selectedValue={min}
								lineColor={colors.text}
								onValueChange={(x) => setMin(x)}
								itemStyle={style.itemText}
							>
								{runtimeOptions.map(renderOption)}
							</WheelPicker>
						</View>
						<View style={style.wheelCover}>
							<Text style={style.title}>Secs</Text>
							<WheelPicker
								style={style.picker}
								selectedValue={sec}
								lineColor={colors.text}
								onValueChange={(x) => setSec(x)}
								itemStyle={style.itemText}
							>
								{runtimeOptions.map(renderOption)}
							</WheelPicker>
						</View>
					</View>

					<TouchableOpacity style={style.button} onPress={submit}>
						<Text style={style.buttonText}>Submit</Text>
					</TouchableOpacity>
				</TouchableOpacity>
			</TouchableOpacity>
		</Modal>
	);
};

RuntimeInput.defaultProps = {
	style: {},
	textStyle: {},
	runtimeSeconds: 0,
};

export default RuntimeInput;
