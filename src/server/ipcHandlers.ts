import { ipcMain } from 'electron';
import Libp2p from 'libp2p';
import { multiaddr } from 'multiaddr';
import { PeerId } from 'libp2p/dist/src/content-routing/utils';
import { IpcEvents } from '../resources/ipcEvents';

export const initIpcHandlers = (node: Libp2p) => {
  ipcMain.on(IpcEvents.RENDERED_READY, async (event) => {
    event.reply(
      IpcEvents.NODE_READY,
      node.multiaddrs.map((address) => {
        return `${address.toString()}/p2p/${node.peerId.toB58String()}`;
      })
    );
  });

  ipcMain.on(IpcEvents.PEER_CONNECT_INIT, async (event, peerPath: string) => {
    const peerId = multiaddr(peerPath).getPeerId();

    if (!peerId) {
      return event.reply(IpcEvents.PEER_CONNECTION_FAILED);
    }

    await node.peerRouting.findPeer(peerId as unknown as PeerId);
    event.reply();
  });
};
