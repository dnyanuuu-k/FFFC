import { API_URL } from "utils/constants";
import DB from "db";

async function perform(code, details, auth = true) {
	const url = API_URL + code;
	console.log("params:", details);
	const headers = {};
	if(auth){
		const token = DB.Account.getCurrentToken();
		headers.Authorization = `Bearer ${token}`;
	}
	return (
		fetch(url, {
			method: "POST",
			timeout: 4000,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				...headers
			},
			body: JSON.stringify(details),
		})
			//.then((response) => response.json())
			.then((response) => response.text())
			.then((res) => {
				console.log(res);
				return JSON.parse(res);
				//return res;
			})
			.catch((error) => {
				console.log(error);
				return false;
			})
	);
}

async function multipartUpload(code, details, file, auth = true) {
	const formData = new FormData();
	for (var key in details) {
		formData.append(key, details[key]);
	}
	formData.append("file", file);
	const headers = {};
	if(auth){
		const token = DB.Account.getCurrentToken();
		headers.Authorization = `Bearer ${token}`;
	}
	return (
		fetch(API_URL + code, {
			method: "POST",
			timeout: 4000,
			body: formData,
			headers
		})
			//.then((response) => response.json())
			.then((response) => response.text())
			.then((res) => {
				console.log(res);
				return JSON.parse(res);
				//return res;
			})
			.catch((error) => {
				console.log(error);
				return false;
			})
	);
}

export { multipartUpload, perform };