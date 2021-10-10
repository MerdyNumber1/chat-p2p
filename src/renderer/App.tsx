import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Main } from './pages/Main';

export const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <Switch>
          <Route path="/" component={Main} />
        </Switch>
      </Router>
    </ChakraProvider>
  );
};
