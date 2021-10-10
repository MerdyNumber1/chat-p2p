import Libp2p from 'libp2p';
import { toString as uint8ArrayToString } from 'uint8arrays';
import { Topics } from './topics';
import IpcMainEvent = Electron.IpcMainEvent;
import { IpcEvents } from '../../resources/ipcEvents';

export const initChatMessageHandler = async (
  node: Libp2p,
  reply: IpcMainEvent['reply']
) => {
  node.pubsub.on(Topics.CHAT_MESSAGE, (msg) => {
    reply(IpcEvents.CHAT_INCOMING_MESSAGE, uint8ArrayToString(msg.data));
  });

  await node.pubsub.subscribe(Topics.CHAT_MESSAGE);
};

export const initPeerHandlers = async (
  node: Libp2p,
  reply: IpcMainEvent['reply']
) => {
  node.connectionManager.on('peer:disconnect', () => {
    reply(IpcEvents.PEER_DISCONNECTED);
  });
};
