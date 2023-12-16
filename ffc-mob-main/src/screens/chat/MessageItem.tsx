import React from 'react';

import Message from './models/Message';
import ImageMessage from './ImageMessage';
import { MineTextBubble, OtherTextBubble } from './TextBubble';
import MessageType from './models/MessageType';

const MessageItem = ({ item, bgColor, textColor }: { item: Message }) => {
  return item.isMine ? (
    <MineTextBubble
      text={item.text}
      avatar={item.avatar}
      name={item.userName}
      bgColor={bgColor}
      textColor={textColor}
      delivery={item.delivery}
    />
  ) : (
    <OtherTextBubble
      text={item.text}
      avatar={item.avatar}
      name={item.userName}            
    />
  );
};

export default MessageItem;