import React, { useState, useEffect, useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import SheetButtonModal from 'components/modal/sheetButtonModal';
import Input from 'components/input';
import { useTheme } from '@react-navigation/native';
import { fonts } from 'themes/topography';
import toast from 'libs/toast';
import validation from 'utils/validation';

const VideoLinkInput = ({ visible, defaultValues, onClose, onSubmit }) => {
	const { colors } = useTheme();
	const [link, setLink] = useState('');
	const [password, setPassword] = useState('');
	const style = useMemo(
		() =>
			StyleSheet.create({
				input: {
					width: '100%',
					height: 40,
					fontSize: fonts.regular,
					marginTop: 10,
					padding: 0,
				},
				desc: {
					fontSize: fonts.small,
					color: colors.holderColor,
				},
			}),
		[colors]
	);
	useEffect(() => {
		if (visible) {
			setLink(defaultValues?.videoUrl || '');
			setPassword(defaultValues?.password || '');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible]);

	const handleSubmit = () => {
		const notValid = !validation.validUrl(link);
		if (notValid) {
			toast.error('Please enter valid link');
		} else {
			onSubmit({
				videoUrl: link,
				password,
			});
		}
	};

	return (
		<SheetButtonModal
			title="Submit video url"
			onClose={onClose}
			onSubmit={handleSubmit}
			visible={visible}
		>
			<Text style={style.desc}>
				Enter link for Youtube, vimeo, dailymotion, google drive or any valid
				video link
			</Text>
			<Input
				placeholder="https://vimeo.com/videoid"
				style={style.input}
				value={link}
				onChangeText={setLink}
			/>
			<Input
				placeholder="Video password (if any)"
				style={style.input}
				value={password}
				onChangeText={setPassword}
			/>
		</SheetButtonModal>
	);
};

export default VideoLinkInput;
