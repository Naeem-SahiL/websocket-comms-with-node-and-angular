import { User } from "./user"

export type WsMessage = ChatMessage | ChatRelayMessage | SystemNotice | LoginMessage | UserListMessage

export interface ChatMessage{
  event: 'chat',
  contents: string
}

export interface ChatRelayMessage{
  event: 'chat-relay',
  contents: string,
  author: User

}
export interface SystemNotice{
  event: 'system-notice',
  contents: string,
}

export interface LoginMessage{
  event: 'login',
  user: User
}

export interface UserListMessage{
  event: 'user-list',
  users: User[]
}
