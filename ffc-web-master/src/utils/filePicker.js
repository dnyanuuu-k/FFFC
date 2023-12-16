const pickMultipleImages = (onChange) => {
	const filePicker = document.getElementById("FFCPicker");
	filePicker.accept = "image/*";
	filePicker.multiple = true;
	filePicker.click();
	filePicker.onchange = () => {
		const selectedFiles = [...filePicker.files];
		onChange(selectedFiles);
		filePicker.value = [];
	};
};

const pickSingleImage = (onChange) => {
	const filePicker = document.getElementById("FFCPicker");
	filePicker.accept = "image/*";
	filePicker.click();
	filePicker.onchange = () => {
		onChange(filePicker.files?.[0] || false);
		filePicker.value = [];
	};
};

const pickSingleVideo = (onChange) => {
	const filePicker = document.getElementById("FFCPicker");
	filePicker.accept = "video/*";
	filePicker.click();
	filePicker.onchange = () => {
		onChange(filePicker.files?.[0] || false);
		filePicker.value = [];
	};
};

const pickMultipleVideos = (onChange) => {
	const filePicker = document.getElementById("FFCPicker");
	filePicker.accept = "audio/*|video/*";
	filePicker.multiple = true;
	filePicker.click();
	filePicker.onchange = () => {
		const selectedFiles = [...filePicker.files];
		onChange(selectedFiles);
		filePicker.value = [];
	};
};

const filePicker = {
	pickMultipleImages,
	pickSingleImage,
	pickSingleVideo,
	pickMultipleVideos
};

export default filePicker;