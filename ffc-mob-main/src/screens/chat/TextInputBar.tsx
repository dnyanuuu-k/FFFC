import React, { useState, useMemo, useRef } from 'react';
import { View, StyleSheet, Image, TextInput, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface TextInputBarProps {
  onSend: (text: string) => void;
}

const TextInputBar = ({ onSend, enabled = false, onTyping }: TextInputBarProps) => {
  const typingRef = useRef();
  const [text, setText] = useState('');
  const { colors } = useTheme();
  const style = useMemo(
    () =>
      StyleSheet.create({
        textInputBar: {
          backgroundColor: colors.card,
          width: '100%',
          flexDirection: 'row',
          height: 50,
          alignItems: 'center',
          borderTopWidth: 1,
          borderColor: colors.border
        },
        textInput: {
          borderRadius: 10,
          paddingHorizontal: 16,
          fontSize: 16,
          margin: 8,
          paddingVertical: 0,
          minWidth: '95%',
          color: colors.text,          
        },
        sendButtonWrapper: {
          position: 'absolute',
          bottom: -4,
          right: 0,
          width: 44,
          height: 40,
          flexShrink: 0,
        },
        sendButton: {
          width: 28,
          height: 28,
        },
      }),
    [colors]
  );

  const onChange = (text) => {
    clearTimeout(typingRef.current);
    setText(text);
    if (text.length) {
      typingRef.current = setTimeout(() => {
        onTyping()
      }, text.length > 1 ? 100 : 350);
    }    
  };

  return (
    <View style={style.textInputBar}>
      <TextInput
        style={style.textInput}
        autoCorrect={false}
        multiline
        editable={enabled}
        onChangeText={onChange}
        value={text}
        placeholder="Enter Message"
        placeholderTextColor={colors.holderColor}
        selectionColor={colors.holderColor}
      />
      <Pressable
        style={style.sendButtonWrapper}
        onPress={() => {
          if (text.length < 1) {
            return;
          }
          onSend(text);
          setText('');
        }}
      >
        <FeatherIcon
          style={{ opacity: text.length < 1 ? 0.3 : 1 }}
          color={colors.primary}
          size={25}
          name='send'
        />
      </Pressable>
    </View>
  );
};

export default TextInputBar;