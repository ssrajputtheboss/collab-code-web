import React, { ChangeEvent, useContext, useState } from 'react';
import { LogInProp } from '../../models';
import { Box, Flex, Input, Button, Text } from '@chakra-ui/react';
import { Context, HOST } from '../../socket';
import { io } from 'socket.io-client';

export const LogInForm = ({ onLogIn }: LogInProp): React.ReactElement => {
  const { state, actions } = useContext(Context);
  const [visible, setVisible] = useState<boolean>(true);
  const [token, setToken] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [roomname, setRoomname] = useState<string>('');
  const [errmsg, setErrmsg] = useState<string>('');

  const validate = (): string => {
    if (/.+\..+\..+/i.exec(token) === null) return 'Invalid Token';
    if (username.length < 4) return 'Username must be of length 4 atleast';
    if (roomname.length < 6) return 'Roomname must be of length 6 atleast';
    if (pass.length < 8 || pass.length > 20) return 'Password must be of length 8 atleast';
    return 'success';
  };

  const create = () => {
    const msg = validate();
    if (msg === 'success') {
      actions({
        type: 'setState',
        payload: { ...state, socket: io(HOST, { extraHeaders: { authorization: token } }) }
      });
      state.socket.emit('create', {
        roomName: roomname,
        userName: username,
        password: pass
      });
      if (!state.socket.hasListeners('create-res'))
        state.socket.on('create-res', (data: any) => {
          const { message } = data;
          if (message === 'success') {
            const { jwt } = data;
            actions({ type: 'setState', payload: { ...state, roomName: roomname, jwt: jwt } });
            setErrmsg('');
            setVisible(false);
            onLogIn();
          } else setErrmsg('Server response: ' + message);
        });
    } else setErrmsg(msg);
  };
  const join = () => {
    const msg = validate();
    if (msg === 'success') {
      actions({
        type: 'setState',
        payload: { ...state, socket: io(HOST, { extraHeaders: { authorization: token } }) }
      });
      state.socket.emit('join', {
        roomName: roomname,
        userName: username,
        password: pass
      });
      if (!state.socket.hasListeners('join-res'))
        state.socket.on('join-res', (data: any) => {
          const { message } = data;
          if (message === 'success') {
            const { jwt, files, users } = data;
            setErrmsg('');
            setVisible(false);
            actions({
              type: 'setState',
              payload: {
                ...state,
                roomName: roomname,
                jwt: jwt,
                files: files,
                users: users,
                activeIndex: files.length === 0 ? -1 : 0
              }
            });
            onLogIn();
          } else setErrmsg('Server response: ' + message);
        });
    } else setErrmsg(msg);
  };

  if (!visible) {
    return <></>;
  }

  return (
    <Box
      as={Flex}
      w='full'
      h='fit-content'
      flexDir='row'
      justifyContent='center'
      alignItems='center'
      p={10}>
      <Flex
        flexDir='column'
        justifyContent='start'
        alignItems='center'
        h='fit-content'
        w={{ base: '300px', lg: '500px' }}
        p='2'>
        <Input
          type='text'
          placeholder='roomname'
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setRoomname(e.target.value);
          }}
          m='2'
        />
        <Input
          type='text'
          placeholder='username'
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setUsername(e.target.value);
          }}
          m='2'
        />
        <Input
          type='text'
          placeholder='token'
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setToken(e.target.value);
          }}
          m='2'
        />
        <Input
          type='password'
          placeholder='password'
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setPass(e.target.value);
          }}
          m='2'
        />
        <Flex flexDir='row' justifyContent='space-around' alignItems='center' w='full' p='2'>
          <Button onClick={create}>Create Room</Button>
          <Button onClick={join}>Join Room</Button>
        </Flex>
        <Text color='red.200'>{errmsg}</Text>
      </Flex>
    </Box>
  );
};
