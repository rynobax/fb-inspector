import React from 'react';

interface Error404Props {
  default: true;
}

const Error404: React.FC<Error404Props> = () => {
  return <h1 style={{ textAlign: 'center' }}>404 not found!</h1>;
};

export default Error404;
