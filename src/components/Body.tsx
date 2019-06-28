import React from 'react';
import { FixedSizeList as List } from 'react-window';
import styled from 'styled-components';

import Node, { ROW_HEIGHT } from 'components/Node';

import { usePath, usePathArr } from 'hooks/path';
import { useProject } from 'hooks/project';
import { useWindowSize } from 'hooks/window';

interface BodyProps {}

const Body: React.FC<BodyProps> = props => {
  const { path, pathStr, setPath } = usePath();
  const { project } = useProject();
  const openPaths = usePathArr();
  const windowSize = useWindowSize();

  function pathAt(i: number) {
    if (i === 0) return [];
    return path.slice(0, i);
  }

  if (!project) return null;

  return (
    <>
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
        <List
          height={windowSize.innerHeight}
          itemSize={ROW_HEIGHT}
          itemCount={openPaths.length}
          width="100%"
        >
          {({ index, style }) => {
            const path = openPaths[index];
            return <Node path={path} key={path.join('/')} style={style} />;
          }}
        </List>
      </Content>
    </>
  );
};

const Content = styled.div``;

const Link = styled.span`
  margin-right: 8px;
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export default Body;
