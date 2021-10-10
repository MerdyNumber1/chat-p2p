import Libp2p from 'libp2p';
import { NOISE } from '@chainsafe/libp2p-noise';
import WebSockets from 'libp2p-websockets';
import MPLEX from 'libp2p-mplex';
import DelegatedPeerRouter from 'libp2p-delegated-peer-routing';
import { logger } from './logger';

export const startNode = async (): Promise<Libp2p> => {
  const node = await Libp2p.create({
    addresses: {
      listen: ['/ip4/127.0.0.1/tcp/8000/ws'],
    },
    modules: {
      transport: [WebSockets],
      connEncryption: [NOISE],
      streamMuxer: [MPLEX],
      peerRouting: [DelegatedPeerRouter],
    },
  });

  await node.start();

  logger.info(
    'Node started, listening on addresses:',
    node.multiaddrs.map((address) => {
      return `${address.toString()}/p2p/${node.peerId.toB58String()}`;
    })
  );

  return node;
};
