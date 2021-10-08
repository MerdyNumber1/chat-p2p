import Libp2p from 'libp2p';
import { NOISE } from '@chainsafe/libp2p-noise';
import WebSockets from 'libp2p-websockets';
import MPLEX from 'libp2p-mplex';

export const startNode = async () => {
  const node = await Libp2p.create({
    addresses: {
      listen: ['/ip4/127.0.0.1/tcp/8000/ws'],
    },
    modules: {
      transport: [WebSockets],
      connEncryption: [NOISE],
      streamMuxer: [MPLEX],
    },
  });

  await node.start();
};
