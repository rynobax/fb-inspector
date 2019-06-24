import React from 'react';
import { IconProps } from './types';

const Close: React.FC<IconProps> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="icon-close"
    width={props.size}
    height={props.size}
  >
    <path
      className="secondary"
      fill-rule="evenodd"
      d="M15.78 14.36a1 1 0 0 1-1.42 1.42l-2.82-2.83-2.83 2.83a1 1 0 1 1-1.42-1.42l2.83-2.82L7.3 8.7a1 1 0 0 1 1.42-1.42l2.83 2.83 2.82-2.83a1 1 0 0 1 1.42 1.42l-2.83 2.83 2.83 2.82z"
    />
  </svg>
);

export default Close;
