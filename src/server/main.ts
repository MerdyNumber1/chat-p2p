import express from 'express';
import { createNode } from './node';

const app = express();

export const run = () => {
  createNode();
  app.get('', (_, res) => res.send('hello world!'));
  app.listen(3000, () => console.log('listening on port 3000!'));
};
