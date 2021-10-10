import { startNode } from './lib/node';
import { initIpcHandlers } from './ipcHandlers';

export const run = async () => {
  const node = await startNode();
  initIpcHandlers(node);
};
