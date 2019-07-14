import React, { Suspense, memo, isValidElement } from 'react';
import styled from 'styled-components';

import Add from 'icons/Add';
import Remove from 'icons/Remove';

import { useFirebase, usePrimeFirebase } from 'hooks/firebase';
import { usePath, useIsPathOpen } from 'hooks/path';
import { FirebaseValue } from 'stores/firebase';
import { getTimeStrFromKey } from 'services/util';
import Tooltip from 'components/Tooltip';

export const ROW_HEIGHT = 28;

function getValueString(v: FirebaseValue) {
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

const SuspendedValue: React.FC<{ path: string[] }> = ({ path }) => {
  const data = useFirebase(path);
  return <>{getValueString(data)}</>;
};

const SuspendedExpand: React.FC<{
  path: string[];
  toggle: () => void;
  open: boolean;
}> = ({ path, toggle, open }) => {
  const data = useFirebase(path);
  const isObject = !!(data && typeof data === 'object');
  if (!isObject) return <ExpandPlaceholder />;

  const iconSize = 16;
  return (
    <Expand onClick={toggle}>
      {open ? <Remove size={iconSize} /> : <Add size={iconSize} />}
    </Expand>
  );
};

interface NodeProps {
  path: string[];
  style: React.CSSProperties;
  ndx: number;
}

const Node: React.FC<NodeProps> = memo(({ path, style, ndx }) => {
  const { open, toggle } = useIsPathOpen(path, ndx === 0);
  const { setPath, path: basePath } = usePath();
  const key = path[path.length - 1] || '/';
  usePrimeFirebase(path);

  const depth = path.length - basePath.length;
  const isTopLevel = depth === 0;

  return (
    <Container depth={depth} style={style}>
      <TooltipWrapper keyStr={key}>
        <Label>
          {isTopLevel ? null : (
            <Suspense fallback={<ExpandPlaceholder />}>
              <SuspendedExpand toggle={toggle} open={open} path={path} />
            </Suspense>
          )}
          <Key expandable={true} onClick={() => setPath(path)}>
            {key}{' '}
          </Key>
        </Label>
      </TooltipWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <SuspendedValue path={path} />
      </Suspense>
    </Container>
  );
});

interface TooltipWrapperProps {
  keyStr: string;
  children: React.ReactNode;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  children,
  keyStr,
}) => {
  if (!isValidElement(children)) throw Error('Tooltip needs children');
  const time = getTimeStrFromKey(keyStr);
  if (!time) return children;
  else return <Tooltip label={time}>{children}</Tooltip>;
};

const Container = styled.div<{ depth: number }>`
  display: flex;
  flex-direction: row;
  margin-left: ${p => Math.max(p.depth - 1, 0) * 14}px;
`;

const EXPAND_SIZE = 18;
const EXPAND_MARGIN = 8;
const Expand = styled.button`
  width: ${EXPAND_SIZE}px;
  height: ${EXPAND_SIZE}px;
  margin-right: ${EXPAND_MARGIN}px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ExpandPlaceholder = styled.div`
  width: ${EXPAND_SIZE}px;
  height: ${EXPAND_SIZE}px;
  margin-right: ${EXPAND_MARGIN}px;
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

export default Node;
