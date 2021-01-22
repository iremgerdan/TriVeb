import React, { useEffect, useState } from 'react';

import Routes from './routers/Routes';

import './App.css';

const App = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (window.socket) {
      setInit(true);
    }
  }, [window.socket]);

  if (!init) {
    return <></>;
  }

  return <Routes />;
};

export default App;
