import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FeatherIcon from "feather-icons-react";
import style from "./style";
import colors from "themes/colors";

const TabbedSection = ({
	width,
	title,
	tabs,
	renderButtons,
	children,
	currentTab,
	onTabChange,
	disabled,
	showTitle,
	onBackPress
}) => {
	const renderTab = (tab, index) => {
		return (
			<TouchableOpacity
				disabled={disabled}
				onPress={() => onTabChange(index)}
				style={style.sectionTab}
				key={index}
			>
				<Text style={style.sectionTitle}>{tab.title}</Text>
				{currentTab === index ? (
					<View style={style.tabSelected} />
				) : null}
			</TouchableOpacity>
		);
	};
	return (
		<View style={[style.section, { width }]}>
			<View style={style.tabSectionCover}>
				{showTitle ?
					<>
					  <TouchableOpacity onPress={onBackPress} style={style.sectionTabIcon}>
					  	<FeatherIcon
					  		icon='arrow-left'
					  		size={23}
					  		color={colors.primaryBlue}
					  	/>
					  </TouchableOpacity>
					  <Text style={style.sectionTitle}>{showTitle}</Text>
				  </>
				: <View
					style={[
						style.tabSectionRow,
						{ opacity: disabled ? 0.5 : 1 },
					]}
				>
					{tabs.map(renderTab)}
				</View>}
				<View style={style.spread} />
				{renderButtons ? (
					<View style={style.sectionTabButtons}>
						{renderButtons()}
					</View>
				) : null}
			</View>
			<View style={style.sectionHr} />
			{children}
		</View>
	);
};

TabbedSection.defaultProps = {
	width: "100%",
	title: "",
};

export default TabbedSection;