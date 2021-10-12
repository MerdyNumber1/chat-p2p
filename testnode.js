const Libp2p = require('libp2p');
const WebSockets = require('libp2p-websockets');
const { NOISE } = require('@chainsafe/libp2p-noise');
const MPLEX = require('libp2p-mplex');
const Gossipsub = require('libp2p-gossipsub');
const ngrok = require('ngrok');
const toMultiaddr = require('uri-to-multiaddr');
const { fromString, toString } = require('uint8arrays');

const main = async () => {
  const url = await ngrok.connect();
  console.log(url);
  console.log('or');
  console.log(toMultiaddr(url));
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

  node.pubsub.on('chat_message', (msg) => {
    console.log(toString(msg.data));
  });

  await node.pubsub.subscribe('chat_message');
  setInterval(() => {
    node.pubsub.publish(
      'chat_message',
      fromString('Bird bird bird, bird is the word!')
    );
  }, 1000);
};

main();
