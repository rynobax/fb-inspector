import React from 'react';

interface HelpProps {
  path: string;
}

const Help: React.FC<HelpProps> = () => {
  return <h2 style={{ textAlign: 'center' }}>This is the help page</h2>;
};

export default Help;
