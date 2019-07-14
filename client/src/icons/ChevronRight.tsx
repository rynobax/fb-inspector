import React from 'react';
import { IconProps } from './types';

const ChevronRight: React.FC<IconProps> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="icon-cheveron-right"
    width={props.size}
    height={props.size}
  >
    <path
      className="secondary"
      d="M10.3 8.7a1 1 0 0 1 1.4-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4l3.29-3.3-3.3-3.3z"
    />
  </svg>
);

export default ChevronRight;
