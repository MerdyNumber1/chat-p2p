import React, { useState, useEffect } from 'react';
import { Button, Center, Heading, Input, Text, Alert } from '@chakra-ui/react';
import { useHistory } from 'react-router';
import { useQuery } from '../hooks/useQuery';
import { IpcEvents } from '../../resources/ipcEvents';

export const Connect: React.VFC = () => {
  const [connectionPeerId, setConnectionPeerId] = useState<string>();
  const [connectionAddress, setConnectionAddress] = useState<string>();
  const [connectionError, setConnectionError] = useState<string>();
  const history = useHistory();
  const pid = useQuery().get('pid');
  const address = useQuery().get('address');

  useEffect(() => {
    window.electron.ipcRenderer.on(IpcEvents.PEER_CONNECTED, () => {
      history.push('/chat');
    });
    window.electron.ipcRenderer.on(
      IpcEvents.PEER_CONNECTION_FAILED,
      (_: void, error: string) => {
        setConnectionError(error);
      }
    );
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.electron.ipcRenderer.send(
      IpcEvents.PEER_CONNECT_INIT,
      JSON.stringify({ peerId: connectionPeerId, address: connectionAddress })
    );
  };

  const onChangePeerId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnectionError('');
    setConnectionPeerId(e.target.value);
  };
  const onChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnectionError('');
    setConnectionAddress(e.target.value);
  };

  return (
    <div>
      <Heading mb={4} size="lg">
        Your peer id:
      </Heading>
      <Text>{pid}</Text>
      <Heading my={4} size="lg">
        Your address:
      </Heading>
      <Text>{address}</Text>
      <Center>
        <Heading size="lg">or</Heading>
      </Center>
      <Heading my={4} size="lg">
        Connect to other peer
      </Heading>
      <form onSubmit={onSubmit}>
        {connectionError && (
          <Alert status="error" mb={3}>
            {connectionError}
          </Alert>
        )}
        <Input
          mb={3}
          onChange={onChangePeerId}
          placeholder="Peer id..."
          required
        />
        <Input onChange={onChangeAddress} placeholder="Address..." required />
        <Button mt={3} type="submit" disabled={!!connectionError}>
          Connect
        </Button>
      </form>
    </div>
  );
};
