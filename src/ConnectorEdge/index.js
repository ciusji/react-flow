import React, { useEffect, useState } from 'react';
import cx from 'classnames';

export default (props) => {
  const [sourceNode, setSourceNode] = useState(null);
  useEffect(() => {
    setSourceNode(props.nodes.find(n => n.id === props.connectionSourceId));
  }, []);

  if (!sourceNode) {
    return null;
  }

  const style = props.style || {};
  const className = cx('react-graph__edge', 'connector', props.className);

  const sourceHandle = sourceNode.__rg.handleBounds.source;
  const sourceHandleX = sourceHandle ? sourceHandle.x + (sourceHandle.width / 2) : sourceNode.__rg.width / 2;
  const sourceHandleY = sourceHandle ? sourceHandle.y + (sourceHandle.height / 2) : sourceNode.__rg.height;
  const sourceX = sourceNode.__rg.position.x + sourceHandleX;
  const sourceY = sourceNode.__rg.position.y + sourceHandleY;

  const targetX = (props.connectionPosition.x * (1 / props.transform[2])) - (props.transform[0] * (1 / props.transform[2]));
  const targetY = (props.connectionPosition.y * (1 / props.transform[2])) - (props.transform[1] * (1 / props.transform[2]));

  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
  const dAttr = `M${sourceX},${sourceY} C${sourceX},${centerY} ${targetX},${centerY} ${targetX},${targetY}`;

  return (
    <path
      className={className}
      d={dAttr}
      {...style}
    />
  );
};