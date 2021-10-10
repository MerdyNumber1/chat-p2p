import React, { useEffect, useState, useRef } from 'react';
import { Box, Input, Button, Text, Link } from '@chakra-ui/react';
import moment from 'moment';
import { useHistory } from 'react-router';
import { IpcEvents } from '../../resources/ipcEvents';

interface ChatMessage {
  message: string;
  date: string;
  isOwn: boolean;
  isDisconnection: boolean;
}

export const Chat: React.VFC = () => {
  const [typingMessage, setTypingMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollContainer = useRef<HTMLDivElement>(null);
  const scrollEnd = useRef<HTMLDivElement>(null);
  const history = useHistory();

  useEffect(() => {
    const incomingMessageListener = (_: void, msg: string) => {
      setMessages((prev) => [
        ...prev,
        {
          message: msg,
          isOwn: false,
          date: moment().format('HH:mm'),
          isDisconnection: false,
        },
      ]);
    };
    window.electron.ipcRenderer.on(
      IpcEvents.CHAT_INCOMING_MESSAGE,
      incomingMessageListener
    );

    const peerDisconnectedListener = (_: void) =>
      setMessages((prev) => [
        ...prev,
        {
          date: moment().format('HH:mm'),
          isDisconnection: true,
          isOwn: false,
          message: '',
        },
      ]);
    window.electron.ipcRenderer.on(
      IpcEvents.PEER_DISCONNECTED,
      peerDisconnectedListener
    );

    return () => {
      window.electron.ipcRenderer.send(IpcEvents.CHAT_LEAVE);
      window.electron.ipcRenderer.removeListener(
        IpcEvents.CHAT_INCOMING_MESSAGE
      );
      window.electron.ipcRenderer.removeListener(IpcEvents.PEER_DISCONNECTED);
    };
  }, []);

  useEffect(() => {
    scrollEnd.current?.scrollIntoView();
  }, [messages]);

  const onChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypingMessage(e.target.value);
  };

  const onSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages((prev) => [
      ...prev,
      {
        message: typingMessage,
        isOwn: true,
        date: moment().format('HH:mm'),
        isDisconnection: false,
      },
    ]);
    window.electron.ipcRenderer.send(
      IpcEvents.CHAT_OUTGOING_MESSAGE,
      typingMessage
    );
    setTypingMessage('');

    scrollEnd.current?.scrollIntoView();
  };

  return (
    <div>
      <Link
        textDecoration="underline"
        onClick={() => history.push('/connect')}
        mb="10px"
      >
        Disconnect
      </Link>
      <Box
        ref={scrollContainer}
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
        p={3}
        height="calc(100vh - 205px)"
        overflowY="scroll"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        {messages.map((msg, i) => (
          <Box
            mt={i && '10px'}
            key={i}
            alignSelf={
              msg.isDisconnection
                ? 'center'
                : msg.isOwn
                ? 'flex-end'
                : 'flex-start'
            }
          >
            {msg.isDisconnection ? (
              <Text>Peer disconnected</Text>
            ) : (
              <Box
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                p="10px"
                position="relative"
              >
                {msg.message}
                <Text position="absolute" top="2px" right="2px" fontSize="10px">
                  {msg.date}
                </Text>
              </Box>
            )}
          </Box>
        ))}
        <Box ref={scrollEnd} />
      </Box>
      <form onSubmit={onSend}>
        <Input
          w="100%"
          my={3}
          onChange={onChangeMessage}
          value={typingMessage}
          required
          placeholder="Message..."
        />
        <Button w="100%" type="submit" color="white" bg="teal">
          Send
        </Button>
      </form>
    </div>
  );
};
