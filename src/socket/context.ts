import { createContext } from 'react';
import { io } from 'socket.io-client';
import { FileData } from '../models';
import { HOST } from './store';
export const Context = createContext({
  state: {
    socket: io(HOST),
    roomName: '',
    jwt: '',
    activeIndex: -1,
    files: new Array<FileData>(0),
    users: new Array<string>(0),
    auth: ''
  },
  actions: (x: any) => {}
});
