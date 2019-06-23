import React from 'react';
import styled from 'styled-components';

import Node from 'components/Node';
import { usePath } from 'hooks/path';

function Main() {
  const { path, setPath } = usePath();
  return (
    <Container>
      <input
        key={path.join('/')}
        defaultValue={path}
        onBlur={e => {
          const newPath = e.target.value.split('/').filter(e => !!e);
          setPath(newPath);
        }}
      />
      {path.map((p, i) => (
        <Link key={i}>{p}</Link>
      ))}
      <Content>
        <Node path={path} depth={0} startOpen />
      </Content>
    </Container>
  );
}

const Container = styled.div`
  max-width: 600px;
  margin: auto;
`;

const Content = styled.div``;

const Link = styled.span`
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export default Main;
