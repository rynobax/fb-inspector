import React, { Suspense } from 'react';
import styled from 'sc';

import { useFirebaseSync, useFirebase } from 'hooks/firebase';

import Add from 'icons/Add';
import Remove from 'icons/Remove';

interface ExpandProps {
  path: string[];
  toggle: () => void;
  open: boolean;
  sync: boolean;
}

const Expand: React.FC<ExpandProps> = props => {
  return (
    <Suspense fallback={<ExpandPlaceholder />}>
      {props.sync ? <SyncExpand {...props} /> : <SuspenseExpand {...props} />}
    </Suspense>
  );
};

const SuspenseExpand: React.FC<ExpandProps> = ({ path, toggle, open }) => {
  const data = useFirebase(path);
  const isObject = !!(data && typeof data === 'object');
  if (!isObject) return <ExpandPlaceholder />;

  const iconSize = 16;
  return (
    <ExpandButton onClick={toggle}>
      {open ? <Remove size={iconSize} /> : <Add size={iconSize} />}
    </ExpandButton>
  );
};

const SyncExpand: React.FC<ExpandProps> = ({ path, toggle, open }) => {
  const data = useFirebaseSync(path);
  if (data === undefined) return <ExpandPlaceholder />;
  const isObject = !!(data && typeof data === 'object');
  if (!isObject) return <ExpandPlaceholder />;

  const iconSize = 16;
  return (
    <ExpandButton onClick={toggle}>
      {open ? <Remove size={iconSize} /> : <Add size={iconSize} />}
    </ExpandButton>
  );
};

const EXPAND_SIZE = 18;
const EXPAND_MARGIN = 8;
const ExpandButton = styled.button`
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

export default Expand;
