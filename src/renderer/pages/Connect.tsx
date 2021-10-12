import React, { useState, useEffect, useContext } from 'react';
import { Button, Center, Heading, Input, Text, Alert } from '@chakra-ui/react';
import { useHistory } from 'react-router';
import { IpcEvents } from '../../resources/ipcEvents';
import { NodeContext } from '../providers/nodeContext';

export const Connect: React.VFC = () => {
  const [connectionPeerId, setConnectionPeerId] = useState<string>();
  const [connectionAddress, setConnectionAddress] = useState<string>();
  const [connectionError, setConnectionError] = useState<string>();
  const { peerId, localAddress, remoteAddress } = useContext(NodeContext);
  const history = useHistory();

  useEffect(() => {
    const peerConnectedListener = () => {
      history.push('/chat');
    };
    const peerConnectionFailedListener = (_: void, error: string) => {
      setConnectionError(error);
    };

    window.electron.ipcRenderer.on(
      IpcEvents.PEER_CONNECTED,
      peerConnectedListener
    );
    window.electron.ipcRenderer.on(
      IpcEvents.PEER_CONNECTION_FAILED,
      peerConnectionFailedListener
    );

    return () => {
      window.electron.ipcRenderer.removeListener(IpcEvents.PEER_CONNECTED);
      window.electron.ipcRenderer.removeListener(
        IpcEvents.PEER_CONNECTION_FAILED
      );
    };
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
      <Text>{peerId}</Text>
      <Heading my={4} size="lg">
        Your local address:
      </Heading>
      <Text>{localAddress}</Text>
      <Heading my={4} size="lg">
        Your remote address:
      </Heading>
      <Text>{remoteAddress}</Text>
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
