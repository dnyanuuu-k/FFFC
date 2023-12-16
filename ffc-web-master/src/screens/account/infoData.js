import React, { Component } from "react";
import { View, Text, Image } from "react-native";
import style from "./style";
import colors from "themes/colors";
const payment = require("assets/images/payment.png");
const platform = require("assets/images/platform.png");
const solution = require("assets/images/solution.png");
export default class InfoData extends Component {
	render() {
		//TODO: Optimize Feature to load from server
		return (
			<View style={style.infoContent}>
				<Text style={style.infoTitle}>Submission Platform</Text>
				<Text style={style.infoSubTitle}>Easiet way to submit films and festivals. Here you can see various film festivals around the world, now you can submit your film to any film festival in the world. </Text>

				<View style={style.featureRow}>
					<View style={style.featureImageCover}>
						<Image
							style={style.featureImage}
							source={payment}
							resizeMode="contain"
						/>
					</View>
					<View>
					<Text style={style.featureTitle}>
						All Payment Methods Supported
					</Text>
					<Text style={style.featureSubtitle}>
						From{" "}
						<Text style={{ color: colors.textBlack }}>
							UPI to All Major Cards
						</Text>{" "}
						we support all national and international payment
						methods get rid of complex process to receive payments.
					</Text>
					</View>
				</View>

				<View style={style.featureRow}>
					<View style={style.featureImageCover}>
						<Image
							style={style.featureImage}
							source={platform}
							resizeMode="contain"
						/>
					</View>
					<View>
					<Text style={style.featureTitle}>
						All Devices Supported
					</Text>
					<Text style={style.featureSubtitle}>
						Work from any where and any devices we have personalized
						app for both{" "}
						<Text style={{ color: colors.primaryBlue }}>
							Android (Playstore)
						</Text>{" "}
						and{" "}
						<Text style={{ color: colors.primaryBlue }}>
							IOS (Appstore)
						</Text>
					</Text>
					</View>
				</View>

				<View style={style.featureRow}>
					<View style={style.featureImageCover}>
						<Image
							style={style.featureImage}
							source={solution}
							resizeMode="contain"
						/>
					</View>
					<View>
					<Text style={style.featureTitle}>One Stop Solution</Text>
					<Text style={style.featureSubtitle}>
						We offer easy to use solutions for managing your
						festival, get rid of all you paperwork become more
						productive with our app.
					</Text>
					</View>
				</View>
			</View>
		);
	}
}