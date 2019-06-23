import React from 'react';
import { IconProps } from './types';

const Remove: React.FC<IconProps> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="icon-remove"
    width={props.size}
    height={props.size}
  >
    <path
      className="secondary"
      fill-rule="evenodd"
      d="M17 11a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2h10z"
    />
  </svg>
);

export default Remove;
