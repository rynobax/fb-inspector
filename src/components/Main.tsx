import React from 'react';
import styled from 'styled-components';

import Node from 'components/Node';
import Header from 'components/Header';
import FirebaseErrorBoundary from './FirebaseErrorBoundary';

import { usePath } from 'hooks/path';
import { useProject } from 'hooks/project';

function Main() {
  const { path, setPath } = usePath();
  const { project } = useProject();

  function pathAt(i: number) {
    return path.slice(0, i + 1);
  }

  const content = project ? (
    <FirebaseErrorBoundary>
      <input
        key={path.join('/')}
        defaultValue={path}
        onBlur={e => {
          const newPath = e.target.value.split('/').filter(e => !!e);
          setPath(newPath);
        }}
      />
      <div>
        <Link onClick={() => setPath([])}>/</Link>
        {path.map((p, i) => (
          <Link key={i} onClick={() => setPath(pathAt(i))}>
            {p}
          </Link>
        ))}
      </div>
      <Content>
        <Node path={path} depth={0} startOpen />
      </Content>
    </FirebaseErrorBoundary>
  ) : null;

  return (
    <>
      <Header />
      <Container>{content}</Container>
    </>
  );
}

const Container = styled.div`
  max-width: 600px;
  margin: auto;
`;

const Content = styled.div``;

const Link = styled.span`
  margin-right: 8px;
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export default Main;
