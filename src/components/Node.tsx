import React, { Suspense } from 'react';
import styled from 'styled-components';

import Add from 'icons/Add';
import Remove from 'icons/Remove';

import { useFirebase, FirebaseValue } from 'hooks/firebase';
import { usePath, useIsPathOpen } from 'hooks/path';

export const ROW_HEIGHT = 46;

function renderValue(v: FirebaseValue) {
  switch (typeof v) {
    case 'string':
      return `"${v}"`;
    case 'number':
      return String(v);
    case 'boolean':
      return String(v);
    case 'object':
      if (!v) return 'null';
      else return null;
  }
}

interface NodeProps {
  path: string[];
}

const Node: React.FC<NodeProps> = ({ path }) => {
  const { open, toggle } = useIsPathOpen(path);
  const { setPath } = usePath();
  const key = path[path.length - 1] || '/';

  const data = useFirebase(path);

  const isObject = !!(data && typeof data === 'object');

  const iconSize = 16;

  const sorted = Object.entries(data || {}).slice();
  sorted.sort(([a], [b]) => a.localeCompare(b));

  return (
    <Container open={open} depth={path.length}>
      <Label>
        {isObject && (
          <Expand onClick={toggle}>
            {open ? <Remove size={iconSize} /> : <Add size={iconSize} />}
          </Expand>
        )}
        <Key expandable={isObject} onClick={() => setPath(path)}>
          {key}{' '}
        </Key>
      </Label>

      <Suspense fallback={null}>
        <ScalarValue>{renderValue(data)}</ScalarValue>
      </Suspense>
    </Container>
  );
};

const Container = styled.div<{ open: boolean; depth: number }>`
  display: flex;
  flex-direction: ${p => (p.open ? 'column' : 'row')};
  margin-left: ${p => p.depth * 14}px;
`;

const Expand = styled.button`
  border-radius: 2px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

const Key = styled.div<{ expandable: boolean }>`
  font-weight: 700;
  margin-left: ${p => (p.expandable ? 0 : 26)}px;

  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const Label = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 8px;
  height: ${ROW_HEIGHT}px;
`;

const ScalarValue = styled.div`
  display: flex;
  flex-direction: column;
`;

export default Node;
