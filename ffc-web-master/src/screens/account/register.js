import React, { Component } from "react";
import { ERROR_TEXT } from "utils/constants";
import { View, Text } from "react-native";
import toast from "react-hot-toast";
import Button from "components/button";
import PhoneInput from "components/input/phoneInput";
import Input from "components/input";
import Backend from "backend";
import style from "./style";
import DB from "db";

export default class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			busy: false,
		};
	}

	registerAccount = async () => {
		try {
			this.setState({ busy: true });
			const { phoneNo, email, password } = this.state;
			const account = await Backend.Account.create({
				password,
				phoneNo,
				email,
			});
			if (account?.success) {
				toast.success("Account Created!");
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
				<Text style={style.title}>Create Account</Text>
				<Text numberOfLines={2} style={style.subTitle}>
					Get started with free account, organize festival or submit
					films.
				</Text>
				<Input
					onChangeText={(email) => this.setState({ email })}
					placeholder="Email"
					keyboardType="email-address"
					style={style.inputStyle}
				/>
				<PhoneInput
					inputProps={{
						onChangeText: (phoneNo) => this.setState({ phoneNo }),
						placeholder: "Phone Number",
					}}
					style={style.inputStyle}
				/>
				<Input
					onChangeText={(password) => this.setState({ password })}
					placeholder="Password"
					style={style.inputStyle}
					secureTextEntry
				/>
				<Button
					disabled={busy}
					busy={busy}
					text="Continue"
					style={style.inputStyle}
					onPress={this.registerAccount}
				/>
				<Button
					disabled={busy}
					text="View Festivals"
					type={Button.OUTLINE_PRIMARY}
					style={style.btnStyle}
				/>
			</View>
		);
	}
}