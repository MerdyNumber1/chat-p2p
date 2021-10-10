import React, { useState } from 'react';
import { Button, Center, Heading, Input, Text } from '@chakra-ui/react';

interface ConnectProps {
  peerId: string;
}

export const Connect: React.VFC<ConnectProps> = ({ peerId }) => {
  const [connectionId, setConnectionId] = useState<string>();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(connectionId);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnectionId(e.target.value);
  };

  return (
    <div>
      <Heading size="lg">Your code:</Heading>
      <Text>{peerId}</Text>
      <Center>or</Center>
      <Heading size="lg">Paste friend&apos;s peer code</Heading>
      <form onSubmit={onSubmit}>
        <Input onChange={onChange} />
        <Button type="submit">Connect</Button>
      </form>
    </div>
  );
};
