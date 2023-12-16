import React from 'react';
import { View, Text } from 'react-native';

import colors from 'themes/colors';
import { fonts } from 'themes/topography';
import moment from 'moment';

const Footer = ({ style = {} }) => {
	const currentYear = moment().format('YYYY');
	return (
		<View style={style}>
			<View style={defaultStyle.row}>
				<Text style={defaultStyle.option}>Privacy Policy</Text>
				<Text style={defaultStyle.option}>Terms and Condition</Text>
				<Text style={defaultStyle.option}>About</Text>
			</View>
			<Text numberOfLines={1} style={defaultStyle.rights}>
				© {currentYear} All Rights Reserved
			</Text>
		</View>
	);
};

const defaultStyle = {
	row: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	option: {
		color: colors.holderColor,
		fontWeight: 300,
		fontSize: fonts.small,
	},
	rights: {
		fontSize: fonts.xsmall,
		color: colors.holderColor,
		fontWeight: 300,
		width: '100%',
		textAlign: 'center',
		marginBottom: 10,
	},
};

export default Footer;
