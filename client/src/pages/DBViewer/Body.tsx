import React, { useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import styled from 'sc';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';

import Node, { ROW_HEIGHT } from './Node';

import { usePath, usePathArr } from 'hooks/path';
import { useProject } from 'hooks/project';
import { useComponentSize } from 'hooks/sizing';
import ChevronRight from 'icons/ChevronRight';
import { useSearch } from 'hooks/firebase';

type SearchType = 'Key' | 'Value';

interface BodyProps {}

const Body: React.FC<BodyProps> = () => {
  const { path, setPath } = usePath();
  const { project } = useProject();
  const timeoutRef = useRef<number | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const openPaths = usePathArr(!isScrolling);
  const contentRef = useRef<HTMLDivElement>(null);
  const size = useComponentSize(contentRef);
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('Key');

  const { data, loading } = useSearch(path, { orderBy: '$value', equalTo: searchText });
  console.log({ data, loading })

  if (!project) return null;

  function pathAt(i: number) {
    if (i === 0) return [];
    return path.slice(0, i);
  }

  const externalUrl = `https://${project.id}.firebaseio.com/${path.join('/')}`;

  let [first, ...filteredPaths] = openPaths;
  if (searchText) {
    if (searchType === 'Key') {
      const depth = path.length;
      filteredPaths = openPaths.filter(
        p => p[depth] !== undefined && p[depth].startsWith(searchText)
      );
    }
    if (searchType === 'Value') {
      console.log({ openPaths, data })
      if (loading) filteredPaths = [];
      else
        filteredPaths = openPaths.filter(
          p => typeof data === 'object' && data && !!data[p[0]]
        );
    }
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
      <SearchContainer>
        <Menu>
          <SearchType>{searchType}</SearchType>

          <MenuList className="slide-down">
            <MenuItem onSelect={() => setSearchType('Key')}>Key</MenuItem>
            <MenuItem onSelect={() => setSearchType('Value')}>Value</MenuItem>
          </MenuList>
        </Menu>
        <SearchBar
          placeholder="search"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
      </SearchContainer>
      <Content ref={contentRef}>
        <List
          height={size.height}
          itemSize={ROW_HEIGHT}
          itemCount={resultPaths.length}
          width="100%"
          style={{ overflowX: 'hidden' }}
          onScroll={() => {
            if (!isScrolling) setIsScrolling(true);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
              setIsScrolling(false);
            }, 250);
          }}
        >
          {({ index, style }) => {
            const path = resultPaths[index];
            return (
              <div style={style}>
                <Node
                  path={path}
                  key={path.join('/')}
                  initiallyOpen={!searchText && index === 0}
                  shouldBeFast={isScrolling}
                  ndx={index}
                />
              </div>
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
  min-height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const SearchType = styled(MenuButton)``;

const SearchBar = styled.input`
  margin-bottom: 8px;
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
