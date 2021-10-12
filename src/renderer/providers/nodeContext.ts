import { createContext } from 'react';

export const NodeContext = createContext({
  peerId: '',
  localAddress: '',
  remoteAddress: '',
  setPeerId: () => {},
  setLocalAddress: () => {},
  setRemoteAddress: () => {},
});
