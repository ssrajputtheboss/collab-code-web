import { MouseEventHandler } from 'react';
import { Socket } from 'socket.io-client';

interface Visible {
  visible: boolean;
}

export interface TabData {
  fname: string;
  isActive: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
}

export interface EditorData extends Visible {
  //onChange : (f:()=> void)=> void
}

export interface LogInProp {
  onLogIn: Function;
}

export interface FileData {
  fname: string;
  content: string;
}

export interface TabsProps extends Visible {
  //onChange : Function
}

export interface GlobalState {
  socket: Socket;
  roomName: string;
  activeIndex: number;
  files: Array<FileData>;
  users: Array<string>;
  jwt: string;
  auth: string;
}

export interface ItemProps {
  name: string;
}

export interface FloatingButtonProps extends Visible {}
