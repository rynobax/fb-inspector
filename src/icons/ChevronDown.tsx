import React from 'react';
import { IconProps } from './types';

const ChevronDown: React.FC<IconProps> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="icon-cheveron-down"
    width={props.size}
    height={props.size}
  >
    <path
      className="secondary"
      fillRule="evenodd"
      d="M15.3 10.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l3.3 3.29 3.3-3.3z"
    />
  </svg>
);

export default ChevronDown;
