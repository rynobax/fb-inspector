import React, { useState } from 'react';
import styled from 'styled-components';

import Add from 'icons/Add';
import Remove from 'icons/Remove';

import { useFirebase } from 'hooks/firebase';
import { usePath } from 'hooks/path';

interface NodeProps {
  path: string[];
  depth: number;
  startOpen?: boolean;
}

const Node: React.FC<NodeProps> = props => {
  const [open, setOpen] = useState(!!props.startOpen);
  const { data, loading } = useFirebase(props.path);
  const { setPath } = usePath();
  const key = props.path[props.path.length - 1] || '/';

  const isObject = data && typeof data === 'object';

  if (loading) return null;

  const iconSize = 16;

  return (
    <Container open={open} depth={props.depth}>
      <Label>
        {isObject && (
          <Expand onClick={() => setOpen(!open)}>
            {open ? <Remove size={iconSize} /> : <Add size={iconSize} />}
          </Expand>
        )}
        <Key onClick={() => setPath(props.path)}>{key}: </Key>
      </Label>

      <Value>
        {!isObject && JSON.stringify(data)}
        {isObject &&
          open &&
          Object.entries(data || {}).map(([k, v]) => {
            const newPath = [...props.path, k];
            return (
              <Node
                key={newPath.join('/')}
                path={newPath}
                depth={props.depth + 1}
              />
            );
          })}
      </Value>
    </Container>
  );
};

const Container = styled.div<{ open: boolean; depth: number }>`
  display: flex;
  flex-direction: ${p => (p.open ? 'column' : 'row')};
  margin-left: ${p => p.depth * 24}px;
`;

const Expand = styled.button`
  background: white;
  padding: 0px;
  border: 1px solid black;
  border-radius: 2px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Key = styled.div`
  font-weight: 700;

  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const Label = styled.div`
  display: flex;
  flex-direction: row;
`;

const Value = styled.div`
  display: flex;
  flex-direction: column;
`;

export default Node;
