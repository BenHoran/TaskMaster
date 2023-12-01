import React from 'react';
import { Provider } from 'react-redux';
import store from './components/store';
import Root from './components/Root';

const App = () => {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
};

export default App;
