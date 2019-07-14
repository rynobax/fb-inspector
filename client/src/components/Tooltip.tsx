import React, { cloneElement, isValidElement } from 'react';
import { TooltipPopup, useTooltip } from '@reach/tooltip';
import Portal from './Portal';

const centered = (triggerRect: DOMRect, tooltipRect: DOMRect): DOMRect => {
  const triggerCenter = triggerRect.left + triggerRect.width / 2;
  const left = triggerCenter - tooltipRect.width / 2;
  const maxLeft = window.innerWidth - tooltipRect.width - 2;
  return {
    left: Math.min(Math.max(2, left), maxLeft) + window.scrollX,
    top: triggerRect.bottom + 8 + window.scrollY,
  } as DOMRect;
};

interface TooltipProps {
  label: string;
  ariaLabel?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, label, ariaLabel }) => {
  // get the props from useTooltip
  const [trigger, tooltip] = useTooltip();

  // destructure off what we need to position the triangle
  const { isVisible, triggerRect } = tooltip;

  if (!isValidElement(children)) throw Error('Tooltip needs children');

  const root = document.getElementById('root');
  if (!root) throw Error('Could not find root');

  return (
    <>
      {cloneElement(children, trigger)}

      {isVisible && (
        // The Triangle. We position it relative to the trigger, not the popup
        // so that collisions don't have a triangle pointing off to nowhere.
        // Using a Portal may seem a little extreme, but we can keep the
        // positioning logic simpler here instead of needing to consider
        // the popup's position relative to the trigger and collisions
        <Portal>
          <div
            style={{
              position: 'absolute',
              left:
                triggerRect && triggerRect.left - 10 + triggerRect.width / 2,
              top: triggerRect && triggerRect.bottom + window.scrollY,
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: '10px solid black',
            }}
          />
        </Portal>
      )}
      <TooltipPopup
        {...tooltip}
        label={label}
        ariaLabel={ariaLabel}
        style={{
          background: 'black',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          // y x
          padding: '8px 16px',
        }}
        position={centered}
      />
    </>
  );
};

export default Tooltip;
