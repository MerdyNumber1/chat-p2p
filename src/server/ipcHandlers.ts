import { ipcMain } from 'electron';
import Libp2p from 'libp2p';
import * as ngrok from 'ngrok';
import toMultiaddr from 'uri-to-multiaddr';
import { createFromB58String } from 'peer-id';
import { fromString as uint8ArrayFromString } from 'uint8arrays';
import { multiaddr } from 'multiaddr';
import { IpcEvents } from '../resources/ipcEvents';
import { initChatMessageHandler } from './pubsub/handlers';
import { Topics } from './pubsub/topics';

export const initIpcHandlers = (node: Libp2p) => {
  ipcMain.on(IpcEvents.RENDERED_READY, async (event) => {
    const remoteAddress = toMultiaddr(
      await ngrok.connect({
        binPath: (path: string) =>
          path.replace('app.asar', 'app.asar.unpacked'),
      })
    );

    event.reply(
      IpcEvents.NODE_READY,
      JSON.stringify({
        localAddress: node.multiaddrs[0].toString(),
        remoteAddress: remoteAddress.toString(),
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

  ipcMain.on(IpcEvents.CHAT_OUTGOING_MESSAGE, (_, msg: string) => {
    node.pubsub.publish(Topics.CHAT_MESSAGE, uint8ArrayFromString(msg));
  });

  ipcMain.on(IpcEvents.CHAT_LEAVE, (_) => {
    node.pubsub.unsubscribe(Topics.CHAT_MESSAGE);
  });
};
