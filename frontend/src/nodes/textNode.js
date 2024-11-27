// /frontend/src/nodes/TextNode.js
import { useState } from 'react';
import { BaseNode } from './baseNode';
import { Position } from 'reactflow';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');

  return (
    <BaseNode
      id={id}
      nodeType="Text"
      fields={[
        { label: 'Text', type: 'text', value: currText, onChange: (e) => setCurrText(e.target.value) },
      ]}
      handles={[
        { type: 'source', position: Position.Right, id: 'output' },
      ]}
    />
  );
};
