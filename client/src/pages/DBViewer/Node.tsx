import React, { memo, isValidElement } from 'react';
import styled from 'sc';
import { areEqual } from 'react-window';

import { useFirebase } from 'hooks/firebase';
import { usePath, useIsPathOpen } from 'hooks/path';
import { getTimeStrFromKey } from 'services/util';

import Tooltip from 'components/Tooltip';

import Value from './Value';
import Expand from './Expand';

export const ROW_HEIGHT = 28;

interface NodeProps {
  path: string[];
  style: React.CSSProperties;
  initiallyOpen: boolean;
  shouldFetch: boolean;
}

const Node: React.FC<NodeProps> = memo(
  ({ path, style, initiallyOpen, shouldFetch }) => {
    const { open, toggle } = useIsPathOpen(path, initiallyOpen);
    const { setPath, path: basePath } = usePath();
    const { data, loading } = useFirebase(path, shouldFetch);
    const key = path[path.length - 1] || '/';

    const depth = path.length - basePath.length;
    const isTopLevel = depth === 0;

    return (
      <Container style={style}>
        <DepthPadding depth={depth} />
        <TooltipWrapper keyStr={key}>
          <Label>
            {isTopLevel ? null : (
              <Expand
                toggle={toggle}
                open={open}
                data={data}
                loading={loading}
              />
            )}
            <Key expandable={true} onClick={() => setPath(path)}>
              {key}{' '}
            </Key>
          </Label>
        </TooltipWrapper>
        <Value data={data} loading={loading} />
      </Container>
    );
  },
  areEqual
);

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

const DepthPadding = styled.div<{ depth: number }>`
  flex: 0 0 auto;
  height: 100%;
  width ${p => Math.max(p.depth - 1, 0) * 14}px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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
  align-items: center;
  margin-right: 8px;
  height: ${ROW_HEIGHT}px;
  flex: 0 0 auto;
`;

export default Node;
