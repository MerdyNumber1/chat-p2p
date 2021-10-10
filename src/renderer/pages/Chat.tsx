import React, { useEffect } from 'react';
import { IpcEvents } from '../../resources/ipcEvents';

export const Chat: React.VFC = () => {
  useEffect(() => {
    window.electron.ipcRenderer.on(
      IpcEvents.INCOMING_CHAT_MESSAGE,
      (_: void, msg: string) => {
        console.log(msg);
      }
    );
  }, []);

  return <div>chat!@</div>;
};
