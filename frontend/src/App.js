import React from 'react';
import { Provider } from 'react-redux';
import store from './components/store';
import Routes from './routes/Routes';

const App = () => {
  return (
    <Provider store={store}>
      <Routes></Routes>
    </Provider>
  );
};

export default App;
