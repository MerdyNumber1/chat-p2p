import { createContext } from 'react';

export const NodeContext = createContext({
  peerId: '',
  address: '',
  setPeerId: () => {},
  setAddress: () => {},
});
