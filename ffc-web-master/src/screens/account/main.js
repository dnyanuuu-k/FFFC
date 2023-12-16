import React, { Component } from "react";
import { View } from "react-native";
//Custom Components
import Header from "components/header/header1";
import Footer from "components/footer/footer1";
import InfoData from "./infoData";
import Register from "./register";
import Login from "./login";

//Utils
import withRouter from "utils/withRouter";

//Styles
import style from "./style";

class Main extends Component {
	static REGISTER_PAGE = "register";
	static FORGOT_PAGE = "forgot_password";

	renderAccount = (page) => {
		switch (page) {
			case Main.REGISTER_PAGE:
				return <Register navigation={this.props.navigation} />;
			case Main.FORGOT_PAGE:
				return <View />;
			default:
				return <Login navigation={this.props.navigation} />;
		}
	};

	render() {
		return (
			<View style={style.main}>
				<Header />
				<View style={style.content}>
					<View style={style.infoCover}>
						<InfoData />
					</View>
					<View style={style.accountCover}>
						{this.renderAccount(this?.props?.route?.params?.['*'])}
						<Footer style={style.footer} />
					</View>
				</View>
			</View>
		);
	}
}

export default withRouter(Main);