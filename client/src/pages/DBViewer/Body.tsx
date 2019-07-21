import React, { useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import styled from 'styled-components';

import Node, { ROW_HEIGHT } from './Node';

import { usePath, usePathArr } from 'hooks/path';
import { useProject } from 'hooks/project';
import { useComponentSize } from 'hooks/sizing';
import ChevronRight from 'icons/ChevronRight';

interface BodyProps {}

const Body: React.FC<BodyProps> = props => {
  const { path, setPath } = usePath();
  const { project } = useProject();
  const openPaths = usePathArr();
  const contentRef = useRef<HTMLDivElement>(null);
  const size = useComponentSize(contentRef);

  function pathAt(i: number) {
    if (i === 0) return [];
    return path.slice(0, i);
  }

  if (!project) return null;

  return (
    <Container>
      <Nav>
        <PathLinks>
          <Link onClick={() => setPath(pathAt(0))}>/</Link>
          {path.map((p, i) => {
            const last = path.length === i;
            return (
              <React.Fragment key={i}>
                {!last && <ChevronRight size={24} />}
                <Link onClick={() => setPath(pathAt(i + 1))}>{p}</Link>
              </React.Fragment>
            );
          })}
        </PathLinks>
      </Nav>
      <Content ref={contentRef}>
        <List
          height={size.height}
          itemSize={ROW_HEIGHT}
          itemCount={openPaths.length}
          width="100%"
          useIsScrolling
          overscanCount={10}
          style={{ overflowX: 'hidden' }}
        >
          {({ index, style, isScrolling }) => {
            const path = openPaths[index];
            return (
              <Node
                path={path}
                key={path.join('/')}
                style={style}
                ndx={index}
              />
            );
          }}
        </List>
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

const PathLinks = styled.div`
  margin-bottom: 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export default Body;
