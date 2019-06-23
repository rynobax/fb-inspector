import React, { useState } from 'react';

import Main from 'pages/Main';
import { PathContext } from 'hooks/path';

const Context: React.FC = () => {
  const [path, setPath] = useState<string[]>([]);
  return (
    <PathContext.Provider value={{ path, setPath }}>
      <Main />
    </PathContext.Provider>
  );
};

export default Context;
