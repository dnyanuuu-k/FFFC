import React, { Component } from "react";
import { View, Text } from "react-native";
import { ERROR_TEXT } from "utils/constants";
import Button from "components/button";
import Input from "components/input";
import style from "./style";
import toast from "react-hot-toast";
import Backend from "backend";
import DB from "db";
export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			busy: false,
		};
	}

	loginAccount = async () => {
		try {
			this.setState({ busy: true });
			const { email, password } = this.state;
			const account = await Backend.Account.login({
				password,
				email,
			});
			if (account?.success) {
				toast.success("Logged In Successfully!");
				DB.Account.setCurrentToken(account.data.token);
				this.props.navigation.navigate("/home");
			} else if (account?.success === false) {
				throw new Error(account.message);
			} else {
				throw new Error(ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			this.setState({ busy: false });
		}
	};

	render() {
		const { busy } = this.state;
		return (
			<View style={style.accountContent}>
				<Text style={style.title}>Login</Text>
				<Text numberOfLines={2} style={style.subTitle}>
					Get started with free account, organize festival or submit
					films.
				</Text>
				<Input
					onChangeText={(email) => this.setState({ email })}
					placeholder="Email"
					style={style.inputStyle}
					keyboardType="email-address"
				/>
				<Input
					onChangeText={(password) => this.setState({ password })}
					placeholder="Password"
					style={style.inputStyle}
					secureTextEntry
				/>
				<Text style={style.link}>Forgot Password?</Text>
				<Button onPress={this.loginAccount} busy={busy} text="Continue" style={style.inputStyle} />
				<Button
					text="View Festivals"
					type={Button.OUTLINE_PRIMARY}
					style={style.btnStyle}
				/>
			</View>
		);
	}
}