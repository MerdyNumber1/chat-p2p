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
    console.log(uint8ArrayToString(msg.data));
    reply(IpcEvents.INCOMING_CHAT_MESSAGE, uint8ArrayToString(msg.data));
  });
  await node.pubsub.subscribe(Topics.CHAT_MESSAGE);
};
