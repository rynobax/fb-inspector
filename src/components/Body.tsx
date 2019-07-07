import React, { useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import styled from 'styled-components';

import Node, { ROW_HEIGHT } from 'components/Node';

import { usePath, usePathArr } from 'hooks/path';
import { useProject } from 'hooks/project';
import { useComponentSize } from 'hooks/sizing';

interface SuspenseListProps {
  revealOrder: 'together' | 'forwards' | 'backwards';
}

const SuspenseList: React.ComponentType<SuspenseListProps> = (React as any)
  .unstable_SuspenseList;

const WINDOWING_THRESHOLD = 20;

interface BodyProps {}

const Body: React.FC<BodyProps> = props => {
  const { path, pathStr, setPath } = usePath();
  const { project } = useProject();
  const openPaths = usePathArr();
  const contentRef = useRef<HTMLDivElement>(null);
  const size = useComponentSize(contentRef);

  function pathAt(i: number) {
    if (i === 0) return [];
    return path.slice(0, i);
  }

  if (!project) return null;

  const shouldWindow = openPaths.length > WINDOWING_THRESHOLD;

  return (
    <Container>
      <Nav>
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
      </Nav>
      <Content ref={contentRef}>
        {shouldWindow ? (
          <List
            height={size.height}
            itemSize={ROW_HEIGHT}
            itemCount={openPaths.length}
            width="100%"
            overscanCount={5}
          >
            {({ index, style }) => {
              const path = openPaths[index];
              return <Node path={path} key={path.join('/')} style={style} />;
            }}
          </List>
        ) : (
          <SuspenseList revealOrder="forwards">
            {openPaths.map(path => {
              return <Node path={path} key={path.join('/')} style={{}} />;
            })}
          </SuspenseList>
        )}
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Nav = styled.div`
  flex: 0;
`;

const Content = styled.div`
  flex: 1;
`;

const Link = styled.span`
  margin-right: 8px;
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export default Body;
