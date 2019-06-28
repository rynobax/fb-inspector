import React from 'react';
import styled from 'styled-components';

import Node from 'components/Node';
import Header from 'components/Header';
import FirebaseErrorBoundary from './FirebaseErrorBoundary';

import { usePath, usePathArr } from 'hooks/path';
import { useProject } from 'hooks/project';

function Main() {
  const { path, pathStr, setPath } = usePath();
  const { project } = useProject();
  const openPaths = usePathArr();

  function pathAt(i: number) {
    if(i === 0) return [];
    return path.slice(0, i);
  }

  const content = project ? (
    <FirebaseErrorBoundary>
      <input
        key={pathStr}
        defaultValue={pathStr.slice(1)}
        onBlur={e => {
          const newPath = e.target.value.split('/').filter(e => !!e);
          setPath(newPath);
        }}
      />
      <div style={{ marginBottom: 12 }}>
        <Link onClick={() => setPath(pathAt(0))}>/</Link>
        {path.map((p, i) => (
          <Link key={i} onClick={() => setPath(pathAt(i + 1))}>
            {p}
          </Link>
        ))}
      </div>
      <Content>
        {openPaths.map(path => (
          <Node path={path} key={path.join('/')} />
        ))}
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
