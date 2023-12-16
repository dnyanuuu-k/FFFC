import React, {
	useEffect,
	useState,
	forwardRef,
	useImperativeHandle,
} from 'react';
import {
	View,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';

// Custom Components
import Input from './index';

// Constants
import { BUTTON_HEIGHT, ERROR_TEXT, XRT } from 'utils/constants';

// Hooks
import { useTheme } from '@react-navigation/native';
import useDebounce from 'hooks/useDebounce';

// Helper functions
import Backend from 'backend';

// Third-Party Components
import FeatherIcon from 'react-native-vector-icons/Feather';

//Third-Party Functions
import aes from 'crypto-js/aes';

const NONE = 0;
const VALIDATING = 1;
const VALIDATED = 2;
const INVALID = 3;
const FAILED = 4;

const ProfileInput = ({ onProfileData, inputStyle }, ref) => {
	const { colors } = useTheme();
	useImperativeHandle(ref, () => {
		setProfile;
	});
	const [profileId, setProfileId] = useState('');
	const [focused, setFocused] = useState(false);
	const [state, setState] = useState(NONE);
	const debounceProfileId = useDebounce(profileId);

	const setProfile = (newProfileId) => {
		handleChangeText(newProfileId);
	};

	const handleChangeText = (text) => {
		const profileIdInt = Number(text);
		if (!Number.isNaN(profileIdInt)) {
			setProfileId(text);
		}
	};

	const loadProfileData = async (id) => {
		try {
			setState(VALIDATING);
			const encrypted = aes.encrypt(id, XRT).toString();
			const response = await Backend.Account.profileBasicData({
				profileId: encrypted,
			});
			if (response.success) {
				setState(VALIDATED);
				onProfileData({
					...response.data,
					id: id,
				});
			} else if (response.success === false) {
				setState(INVALID);
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			console.log(err);
			setState(FAILED);
		}
	};

	const clearProfile = () => {
		setState(NONE);
		setProfile('');
		onProfileData(null);
	};

	const renderState = () => {
		switch (state) {
			case VALIDATING:
				return <ActivityIndicator color={colors.primary} size={18} />;
			case VALIDATED:
				return (
					<FeatherIcon size={20} color={colors.greenDark} name="user-check" />
				);
			case INVALID:
				return <FeatherIcon size={20} color={colors.rubyRed} name="user-x" />;
			case FAILED:
				return (
					<FeatherIcon size={20} color={colors.rubyRed} name="refresh-cw" />
				);
			default:
				return null;
		}
	};

	useEffect(() => {
		if (debounceProfileId) {
			loadProfileData(debounceProfileId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debounceProfileId]);

	const borderColor = focused ? colors.primary : colors.border;
	return (
		<View style={style.main}>
			<Input
				style={inputStyle}
				value={profileId}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				placeholder="Profile ID"
				onChangeText={handleChangeText}
			/>
			{state !== NONE ? (
				<View style={style.options}>
					<TouchableOpacity
						onPress={clearProfile}
						style={[style.option, style.border, { borderColor }]}
					>
						<FeatherIcon size={23} color={colors.holderColor} name="x" />
					</TouchableOpacity>
					<TouchableOpacity style={style.option}>
						{renderState(state)}
					</TouchableOpacity>
				</View>
			) : null}
		</View>
	);
};

const style = StyleSheet.create({
	main: {
		width: '100%',
	},
	border: {
		borderRightWidth: 1,
		borderLeftWidth: 1,
	},
	option: {
		height: BUTTON_HEIGHT,
		width: 45,
		justifyContent: 'center',
		alignItems: 'center',
	},
	options: {
		marginTop: 10,
		position: 'absolute',
		right: 0,
		flexDirection: 'row',
	},
});

export default forwardRef(ProfileInput);