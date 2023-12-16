import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  View,
  Text,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import TextInputBar from './TextInputBar';
import MessageItem from './MessageItem';
import Message from './models/Message';
import LinearGradient from 'react-native-linear-gradient';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import { HEADER_HEIGHT, CHAT_COLORS } from 'utils/constants';
import { fonts, weights } from 'themes/topography';
import helper from 'utils/helper';

const { RNTinodeClient } = NativeModules;
const tinodeEventEmitter = new NativeEventEmitter();

export const AVATAR_BOX_SIZE = 40;

const Messages = ({ route }) => {
  const topicName = route.params.topic;
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [inputEnable, setInputEnable] = useState(false);
  const timerRef = useRef(null);
  const { colors, dark } = useTheme();
  const style = useMemo(
    () =>
      StyleSheet.create({
        main: {
          flex: 1,
          backgroundColor: colors.card,
        },
        header: {
          height: HEADER_HEIGHT + 10,
          alignItems: 'center',
          backgroundColor: colors.card,
          flexDirection: 'row',
          elevation: 2,
          borderBottomWidth: dark ? 1 : 0,
          borderColor: colors.border,
          paddingTop: StatusBar.currentHeight
        },
        arrowBox: {
          width: 50,
          height: AVATAR_BOX_SIZE,
          justifyContent: 'center',
          alignItems: 'center'
        },
        avatarCover: {
          width: AVATAR_BOX_SIZE,
          height: AVATAR_BOX_SIZE,
          borderRadius: 100,
          marginRight: 10,
          justifyContent: 'center',
          alignItems: 'center',
        },
        avatarTxt: {
          fontSize: fonts.small ,
          fontWeight: weights.semibold,
          color: colors.buttonTxt,
        },
        content: {
          flex: 1,
        },
        name: {
          width: '80%',
          fontSize: fonts.regular,
          fontWeight: weights.semibold,
          color: colors.text
        },
        desc: {
          fontSize: fonts.small,
        }
      }),
    [colors]
  );

  const dispatchTyping = (typing = true) => {
    if(timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsTyping(typing);
    if(typing) {
      timerRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }    
  }

  const avatarName = useMemo(() => {
    return userData?.name ? helper.getAvatarName(userData.name) : '..';
  }, [userData.name]);

  useEffect(() => {
    let onMessage = null;
    let onError = null;
    let onUserUpdate = null;
    let onTypingStatus = null;
    // Init Client
    RNTinodeClient.initChatScreen()
      .then(() => {
        // Start Chat
        RNTinodeClient.startChat(topicName)
          .then(() => {            
            RNTinodeClient.readMessages();
            onMessage = tinodeEventEmitter.addListener(
              'onMessageChange',
              (list) => {
                console.log(list[list.length - 1])
                setMessages(list);
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
                setInputEnable(true);
                setUserData(data);
              }
            );
            onTypingStatus = tinodeEventEmitter.addListener(
              'onTypingStatus',
              (typing) => {
                dispatchTyping(typing);
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
          // console.log('Chat Stopped')
        })
        .catch(() => {
          // console.log('error')
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
      if (onTypingStatus) {
        onTypingStatus.remove();
      }
    };
  }, []);

  const sendTyping = () => {
    RNTinodeClient.sendTyping();
  }

  const renderMessage = ({ item }) => {
    return (
      <MessageItem item={item} bgColor={colors.border} textColor={colors.text} />
    );
  };

  const desc = userData?.isOnline ? 'Online' : 'seen ' + (userData?.lastseen || '');
  const descColor = userData?.isOnline ? colors.greenDark : colors.holderColor;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
      style={style.main}
    >
      <View style={style.header}>
        <View style={style.arrowBox}>
          <FeatherIcon name='arrow-left' size={22} color={colors.text} />
        </View>
        <LinearGradient colors={CHAT_COLORS} style={style.avatarCover}>
          <Text style={style.avatarTxt}>{avatarName}</Text>
        </LinearGradient>
        <View style={style.content}>
          <Text style={style.name}>{userData.name || 'Loading..'}</Text>
          <Text style={[style.desc, { color: descColor }]}>{isTyping ? 'typing..' : desc}</Text>          
        </View>
      </View>
      <FlashList
        renderItem={renderMessage}
        inverted
        showsVerticalScrollIndicator={false}
        estimatedItemSize={100}
        keyExtractor={(item) => {
          return item.seqId;
        }}
        data={messages}
      />
      <TextInputBar
        enabled={inputEnable}
        onTyping={sendTyping}
        onSend={(text) => {
          RNTinodeClient.sendMessage(text);
        }}
      />
    </KeyboardAvoidingView>
  );
};

export default Messages;