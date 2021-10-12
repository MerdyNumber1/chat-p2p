import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, Route, Switch } from 'react-router';
import { Container, Center, Spinner } from '@chakra-ui/react';
import { IpcEvents } from '../../resources/ipcEvents';
import { Connect } from './Connect';
import { Chat } from './Chat';
import { NodeContext } from '../providers/nodeContext';

export const Main: React.VFC = () => {
  const [isNodeReady, setIsNodeReady] = useState<boolean>(false);
  const [peerId, setPeerId] = useState('');
  const [localAddress, setLocalAddress] = useState('');
  const [remoteAddress, setRemoteAddress] = useState('');

  const history = useHistory();

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IpcEvents.NODE_READY,
      (_: void, addr: string) => {
        const {
          peerId: nodePeerId,
          localAddress: nodeLocalAddress,
          remoteAddress: nodeRemoteAddress,
        } = JSON.parse(addr);

        setPeerId(nodePeerId);
        setLocalAddress(nodeLocalAddress);
        setRemoteAddress(nodeRemoteAddress);

        setIsNodeReady(true);
        history.push(`/connect`);
      }
    );

    window.electron.ipcRenderer.send(IpcEvents.RENDERED_READY);
  }, []);

  const nodeContextValue = useMemo(
    () => ({
      peerId,
      setPeerId,
      localAddress,
      setLocalAddress,
      remoteAddress,
      setRemoteAddress,
    }),
    [peerId, localAddress, remoteAddress]
  );

  return isNodeReady ? (
    <NodeContext.Provider value={nodeContextValue as any}>
      <Container my="50px" maxW="container.sm">
        <Switch>
          <Route path="/connect" component={Connect} />
          <Route component={Chat} path="/chat" />
        </Switch>
      </Container>
    </NodeContext.Provider>
  ) : (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  );
};
