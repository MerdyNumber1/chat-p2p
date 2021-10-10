export enum IpcEvents {
  RENDERED_READY = 'renderer_ready',
  NODE_READY = 'node_ready',
  PEER_CONNECT_INIT = 'peer_connect_init',
  PEER_CONNECTED = 'peer_connected',
  PEER_CONNECTION_FAILED = 'peer_connection_failed',
  PEER_DISCONNECTED = 'peer_disconnected',
  CHAT_INCOMING_MESSAGE = 'chat_incoming_message',
  CHAT_OUTGOING_MESSAGE = 'chat_outgoing_message',
  CHAT_LEAVE = 'chat_leave',
}
