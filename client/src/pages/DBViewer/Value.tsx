import React from 'react';
import { FirebaseValue } from 'stores/store';
import styled from 'sc';

function getValueString(v: FirebaseValue | undefined) {
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
    case 'undefined':
      throw Error(`Cannot get value string for undefined`);
  }
}

interface ValueProps {
  data: FirebaseValue | undefined;
  loading: boolean;
}

const Value: React.FC<ValueProps> = ({ loading, data }) => {
  if (loading) return null;
  const value = getValueString(data);
  return (
    <ValueContainer title={value ? value : undefined}>{value}</ValueContainer>
  );
};

const ValueContainer = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1 1 0px;
  overflow: hidden;
`;

const LOADING_PRIMARY = '#e0e0e0';
const LOADING_SECONDARY = '#f3f3f3';

const LoadingBar = styled.div`
  height: 10px;
  width: 96px;
  border-radius: 100px;

  /* Animation */
  background: linear-gradient(
    270deg,
    ${LOADING_PRIMARY} 0%,
    ${LOADING_PRIMARY} 25%,
    ${LOADING_SECONDARY} 50%,
    ${LOADING_SECONDARY} 75%
  );
  background-size: 400% 400%;

  animation: ColorFade 3s ease infinite, FadeIn 1s;

  @keyframes ColorFade {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes FadeIn {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

export default Value;
