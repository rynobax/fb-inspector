import React, { useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import styled from 'sc';

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
  const [search, setSearch] = useState('');

  if (!project) return null;

  function pathAt(i: number) {
    if (i === 0) return [];
    return path.slice(0, i);
  }

  const externalUrl = `https://${project.id}.firebaseio.com/${path.join('/')}`;

  let [first, ...filteredPaths] = openPaths;
  if (search) {
    const depth = path.length;
    filteredPaths = openPaths.filter(
      p => p[depth] !== undefined && p[depth].startsWith(search)
    );
  }

  const resultPaths = [first, ...filteredPaths];

  return (
    <Container>
      <Nav>
        <PathLinks>
          <PathLink onClick={() => setPath(pathAt(0))}>/</PathLink>
          {path.map((p, i) => {
            const last = path.length === i;
            return (
              <React.Fragment key={i}>
                {!last && <ChevronRight size={24} />}
                <PathLink onClick={() => setPath(pathAt(i + 1))}>{p}</PathLink>
              </React.Fragment>
            );
          })}
        </PathLinks>
        <ExternalLink href={externalUrl} target="_blank">
          Live FB
        </ExternalLink>
      </Nav>
      <SearchBar
        placeholder="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <Content ref={contentRef}>
        <List
          height={size.height}
          itemSize={ROW_HEIGHT}
          itemCount={resultPaths.length}
          width="100%"
          useIsScrolling
          overscanCount={10}
          style={{ overflowX: 'hidden' }}
        >
          {({ index, style, isScrolling }) => {
            const path = resultPaths[index];
            return (
              <Node
                path={path}
                key={path.join('/')}
                style={style}
                initiallyOpen={!search && index === 0}
                shouldFetch={!isScrolling}
              />
            );
          }}
        </List>
      </Content>
    </Container>
  );
};

const SearchBar = styled.input`
  margin-bottom: 8px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Nav = styled.div`
  flex: 0;
  min-height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Content = styled.div`
  flex: 1;
`;

const PathLink = styled.span`
  margin-right: 8px;
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const PathLinks = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ExternalLink = styled.a`
  color: ${p => p.theme.color.text.primary};

  :visited {
    color: ${p => p.theme.color.text.primary};
  }

  :active {
    color: ${p => p.theme.color.text.primary};
  }
`;

export default Body;
