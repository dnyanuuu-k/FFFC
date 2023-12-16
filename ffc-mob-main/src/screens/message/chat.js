useEffect(() => {
	let onMessage = null;
	let onError = null;
	let onUserUpdate = null;
	// Init Client
	RNTinodeClient.initChatScreen()
		.then(() => {
			// Start Chat
			RNTinodeClient.startChat(topicName)
				.then(() => {
					onMessage = tinodeEventEmitter.addListener(
						'onMessageChange',
						(list) => {
							setMessages(list);
							console.log(list.length);
						}
					);
					onError = tinodeEventEmitter.addListener(
						'onSubscriptionError',
						(err) => {
							console.log(err);
						}
					);
					onUserUpdate = tinodeEventEmitter.addListener(
						'onUserUpdate',
						(data) => {
							console.log(data);
						}
					);
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => {
			console.log(err);
		});

	return () => {
		RNTinodeClient.stopChat()
			.then(() => {
				console.log('DOne');
			})
			.catch(() => {
				console.log('error');
			});
		if (onMessage) {
			onMessage.remove();
		}
		if (onError) {
			onError.remove();
		}
		if (onUserUpdate) {
			onUserUpdate.remove();
		}
	};
}, []);