import React from "react";
import {
	View,
	Text,
	StyleSheet
} from 'react-native';

// Third-Party Components
import FeatherIcon from "feather-icons-react";

// Constants
import { BORDER_RADIUS } from "utils/constants";
import colors from "themes/colors";
import shadows from "themes/shadows";

const SubmissionCard = ({ data, width }) => {
	return (
		<View style={[style.card, { width }]}>	
			<View style={style.header}>				
				<Text style={style.trackingId}>{data.trackingId}</Text>
				<Text style={style.title} numberOfLines={1}>{data.title}</Text>				
				<View style={style.statRow}>
					<Stat
						title={"Director"}
						value={data.director}
						width={"100%"}
					/>

					<Stat
						title={"Category"}
						value={data.category}
					/>	

					<Stat
						title={"Runtime"}
						value={data.runtime}
						align="flex-end"
					/>

					<Stat
						title={"Origin"}
						value={data.origin}
					/>				

					<Stat
						title={"Date"}
						value={data.date}
						align="flex-end"
					/>
				</View>
			</View>
			<View style={style.footer}>
				<View style={{ flexDirection: "row" }}>
					<div className="sb-status" style={{ cursor: 'pointer', display: "flex", alignItems: "center", marginRight: 10, height: 25, flexDirection: "row", backgroundColor: colors.rubyRedLight, borderRadius: 3 }}>
						<View style={{ marginHorizontal: 5, width: 12, height: 12, backgroundColor: colors.rubyRed, borderRadius: 30 }} />
						<FeatherIcon
							color={colors.rubyRed}
							size={15}
							icon="chevron-down"
							style={{ marginLeft: 5, marginRight: 5 }}
						/>
					</div>

					<div className="sb-flag" style={{ display: "flex", alignItems: "center", width: 100, marginRight: 10, height: 25, flexDirection: "row", backgroundColor: colors.greenLight, borderRadius: 3 }}>
						<View style={{ marginHorizontal: 5, width: 12, height: 12, backgroundColor: colors.greenDark, borderRadius: 30 }} />
						<Text numberOfLines={1} style={{ fontSize: 12, width: 50, fontWeight: '500', color: colors.greenDark }}>Green</Text>
						<FeatherIcon
							color={colors.green}
							size={15}
							icon="chevron-down"
							style={{ marginLeft: 5, marginRight: 5 }}
						/>
					</div>
				</View>

				<div className="sb-judge" style={{ display: "flex", alignItems: "center", height: 25, flexDirection: "row", backgroundColor: colors.borderColor, borderRadius: 3 }}>
					<View style={{ marginHorizontal: 5, width: 12, height: 12, backgroundColor: colors.holderColor, borderRadius: 30 }} />
					<Text style={{ fontSize: 12, fontWeight: '500', color: colors.holderColor }}>Undecided</Text>

					<FeatherIcon
						color={colors.holderColor}
						size={15}
						icon="chevron-down"
						style={{ marginLeft: 5, marginRight: 5 }}
					/>
				</div>

			</View>

			<div className="sb-assign" style={style.assignButton}>
				<FeatherIcon
					color={colors.primaryBlue}
					size={14}
					strokeWidth={2}
					icon="user-plus"
				/>
			</div>
		</View>
	);
}

const Stat = ({ title, value, width = "50%", align = "flex-start" }) => (
	<View style={[style.stat, { width, justifyContent: align }]}>
		<Text style={style.statKey}>{title} : </Text>
		<Text style={style.statVal}>{value}</Text>
	</View>
)

const style = StyleSheet.create({
	card: {
		backgroundColor: colors.wht,	
		borderRadius: BORDER_RADIUS,		
		height: 200,
		boxShadow: shadows.material
	},
	header: {
		padding: 10,
		flex: 1
	},
	footer: {
		height: 50,
		borderTopWidth: 1,
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 10,
		borderColor: colors.borderColor,
		flexDirection: "row"
	},
	trackingId: {
		color: colors.buttonTxt,
		backgroundColor: colors.primaryBlue,
		paddingHorizontal: 5,
		paddingVertical: 3,
		alignSelf: "flex-start",
		borderRadius: 2,
		marginBottom: 5,
		fontWeight: "500",
		fontSize: 12
	},
	title: {
		color: colors.textBlack,
		fontWeight: "600",
		fontSize: 16,
		width: "95%",
		marginBottom: 5,
		marginTop: 3	
	},
	stat: {
		flexDirection: "row",
		marginTop: 10,
		alignItems: "center"
	},
	statRow: {
		flexDirection: "row",
		flexWrap: "wrap"
	},
	statKey: {
		fontSize: 12,
		color: colors.holderColor,
		fontWeight: '500'
	},
	statVal: {
		fontSize: 12,
		color: colors.textBlack,
		fontWeight: '500'
	},
	assignButton: {
		display: "flex",
		width: 30,
		height: 30,
		backgroundColor: colors.primaryLight,
		position: "absolute",
		top: 5,
		right: 5,
		borderRadius: 60,
		justifyContent: "center",
		alignItems: "center"
	}
});

export default SubmissionCard;