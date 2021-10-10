const Libp2p = require('libp2p');
const WebSockets = require('libp2p-websockets');
const { NOISE } = require('@chainsafe/libp2p-noise');
const MPLEX = require('libp2p-mplex');
const Gossipsub = require('libp2p-gossipsub');
const { fromString } = require('uint8arrays');

const main = async () => {
  const node = await Libp2p.create({
    addresses: {
      listen: ['/ip4/127.0.0.1/tcp/8080/ws'],
    },
    modules: {
      transport: [WebSockets],
      connEncryption: [NOISE],
      streamMuxer: [MPLEX],
      pubsub: Gossipsub,
    },
  });

  await node.start();
  console.log(
    node.multiaddrs.map((address) => {
      return `${address.toString()}/p2p/${node.peerId.toB58String()}`;
    })
  );

  await node.pubsub.subscribe('incoming_chat_message');
  setInterval(() => {
    node.pubsub.publish(
      'incoming_chat_message',
      fromString('Bird bird bird, bird is the word!')
    );
  }, 1000);
};

main();
