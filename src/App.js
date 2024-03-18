import React, { useState } from 'react';
import Menu from './components/Menu';
import Tabs from './components/Tabs';

function App() {
  const [page, setPage] = useState('plans');

  const handleMenuClick = (selectedPage) => {
    setPage(selectedPage);
  };

  return (
    <div>
      <Menu onMenuClick={handleMenuClick} />
      <div>
        <Tabs />
      </div>
    </div>
  );
}

export default App;


