import React from "react";
import { View, StyleSheet } from "react-native";
import { Routes, Route } from "react-router-dom";

// Custom Components
import SideBar from "components/sidebar";

// Screens
import CartScreen from "../cart";
import HomeScreen from "./screen";

const Account = () => (
	<View style={style.row}>
		<SideBar />
		<Routes>
			<Route path="/" element={<HomeScreen />} />
			<Route path="/cart" element={<CartScreen />} />
		</Routes>
	</View>
);

const style = StyleSheet.create({
	row: {
		flexDirection: "row",
	},
});

export default Account;