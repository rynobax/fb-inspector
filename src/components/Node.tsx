import React, { Suspense } from 'react';
import styled from 'styled-components';

import Add from 'icons/Add';
import Remove from 'icons/Remove';

import { useFirebase, FirebaseValue } from 'hooks/firebase';
import { usePath, useIsPathOpen } from 'hooks/path';

const ROW_HEIGHT = 46;

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
  depth: number;
  startOpen?: boolean;
}

const Node: React.FC<NodeProps> = props => {
  const { open, toggle } = useIsPathOpen(props.path);
  // const [open, setOpen] = useState(!!props.startOpen);
  const { setPath } = usePath();
  const key = props.path[props.path.length - 1] || '/';

  const data = useFirebase(props.path);

  const isObject = !!(data && typeof data === 'object');

  const iconSize = 16;

  const sorted = Object.entries(data || {}).slice();
  sorted.sort(([a], [b]) => a.localeCompare(b));

  return (
    <Container open={open} depth={props.depth}>
      <Label>
        {isObject && (
          <Expand onClick={toggle}>
            {open ? <Remove size={iconSize} /> : <Add size={iconSize} />}
          </Expand>
        )}
        <Key expandable={isObject} onClick={() => setPath(props.path)}>
          {key}{' '}
        </Key>
      </Label>

      <Suspense fallback={null}>
        <Value>
          {isObject
            ? sorted.map(([k, v]) => {
                if (!open) return null;
                const newPath = [...props.path, k];
                return (
                  <Node
                    key={newPath.join('/')}
                    path={newPath}
                    depth={props.depth + 1}
                  />
                );
              })
            : <ScalarValue>{renderValue(data)}</ScalarValue>}
        </Value>
      </Suspense>
    </Container>
  );
};

const Container = styled.div<{ open: boolean; depth: number }>`
  display: flex;
  flex-direction: ${p => (p.open ? 'column' : 'row')};
  margin-left: ${p => p.depth * 14}px;
  /* padding-top: 4px;
  padding-bottom: 4px; */
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

const Value = styled.div`
  display: flex;
  flex-direction: column;
`;

const ScalarValue = styled.div`
  display: flex;
  flex-direction: column;
`;

export default Node;
