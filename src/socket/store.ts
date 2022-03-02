import { useState } from 'react';
import { io } from 'socket.io-client';
import { GlobalState } from '../models';

export const HOST = 'localhost:4000';

export const useGlobalStore = () => {
  const [state, setState] = useState<GlobalState>({
    socket: io(HOST),
    roomName: '',
    jwt: '',
    activeIndex: -1,
    files: [],
    users: [],
    auth: ''
  });

  const actions = (action: { type: string; payload: GlobalState }) => {
    const { type, payload }: { type: string; payload: GlobalState } = action;
    switch (type) {
      case 'setState':
        return setState(payload);
      default:
        return state;
    }
  };

  return { state, actions };
};
