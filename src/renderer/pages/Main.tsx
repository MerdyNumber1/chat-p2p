import React, { useState, useEffect } from 'react';
import { useHistory, Route, Switch } from 'react-router';
import { Container, Center, Spinner } from '@chakra-ui/react';
import { IpcEvents } from '../../resources/ipcEvents';
import { Connect } from './Connect';
import { Chat } from './Chat';

export const Main: React.VFC = () => {
  const [isNodeReady, setIsNodeReady] = useState<boolean>(false);

  const history = useHistory();

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IpcEvents.NODE_READY,
      (_: void, addr: string) => {
        const { peerId, address } = JSON.parse(addr);
        setIsNodeReady(true);
        history.push(`/connect?pid=${peerId}&address=${address}`);
      }
    );

    window.electron.ipcRenderer.send(IpcEvents.RENDERED_READY);
  }, []);

  return isNodeReady ? (
    <Container my="50px" maxW="container.sm">
      <Switch>
        <Route component={Connect} path="/connect" />
        <Route component={Chat} path="/chat" />
      </Switch>
    </Container>
  ) : (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  );
};
