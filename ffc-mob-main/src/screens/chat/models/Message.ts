export interface TextMessage {
  seqId: string;
  text: string;
  isMine: boolean;
  userName: string;
}

type Message = TextMessage;

export default Message;
