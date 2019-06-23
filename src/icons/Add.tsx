import React from 'react';
import { IconProps } from './types';

const Add: React.FC<IconProps> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="icon-add"
    width={props.size}
    height={props.size}
  >
    <path
      className="secondary"
      fill-rule="evenodd"
      d="M17 11a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4V7a1 1 0 0 1 2 0v4h4z"
    />
  </svg>
);

export default Add;
