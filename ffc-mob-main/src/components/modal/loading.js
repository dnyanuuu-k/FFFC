import React from 'react';
import { View, Modal, ActivityIndicator } from 'react-native';
import colors from 'themes/colors';

const Loading = ({ busy = true } = {}) => {
	return (
		<Modal visible={busy} transparent animationType="fade">
			<View style={style.main}>
				<ActivityIndicator size={35} color={colors.buttonTxt} />
			</View>
		</Modal>
	);
};

const style = {
	main: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
		backgroundColor: colors.bgTrans,
	},
};

export default Loading;
