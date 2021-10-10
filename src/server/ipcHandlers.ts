import { ipcMain } from 'electron';
import Libp2p from 'libp2p';
import { createFromB58String } from 'peer-id';
import { multiaddr } from 'multiaddr';
import { IpcEvents } from '../resources/ipcEvents';
import { initChatMessageHandler } from './pubsub/handlers';

export const initIpcHandlers = (node: Libp2p) => {
  ipcMain.on(IpcEvents.RENDERED_READY, async (event) => {
    event.reply(
      IpcEvents.NODE_READY,
      JSON.stringify({
        address: node.multiaddrs[0].toString(),
        peerId: node.peerId.toB58String(),
      })
    );
  });

  ipcMain.on(IpcEvents.PEER_CONNECT_INIT, async (event, addr: string) => {
    let { peerId, address } = JSON.parse(addr);

    try {
      peerId = createFromB58String(peerId);
      address = multiaddr(address);

      node.peerStore.addressBook.set(peerId, [address]);

      await node.dial(peerId);
    } catch (err: any) {
      return event.reply(IpcEvents.PEER_CONNECTION_FAILED, err.message);
    }

    event.reply(IpcEvents.PEER_CONNECTED);

    await initChatMessageHandler(node, event.reply.bind(event));
  });
};
