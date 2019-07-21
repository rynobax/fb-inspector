import React from 'react';
import styled from 'sc';

import Add from 'icons/Add';
import Remove from 'icons/Remove';
import { FirebaseValue } from 'stores/store';

interface ExpandProps {
  toggle: () => void;
  open: boolean;
  loading: boolean;
  data: FirebaseValue | undefined;
}

const Expand: React.FC<ExpandProps> = ({ toggle, open, loading, data }) => {
  if (loading) return <ExpandPlaceholder />;
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
