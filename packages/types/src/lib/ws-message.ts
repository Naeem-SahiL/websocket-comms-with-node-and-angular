export type WsMessage = ChatMessage | ChatRelayMessage | SystemNotice

export interface ChatMessage{
  event: 'chat',
  contents: string
}

export interface ChatRelayMessage{
  event: 'chat-relay',
  contents: string,
  author: string

}
export interface SystemNotice{
  event: 'system-notice',
  contents: string,
}
