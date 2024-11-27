// /frontend/src/nodes/LLMNode.js
import { BaseNode } from './baseNode';
import { Position } from 'reactflow';

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      nodeType="LLM"
      fields={[]}
      handles={[
        { type: 'target', position: Position.Left, id: 'system', style: { top: '33%' } },
        { type: 'target', position: Position.Left, id: 'prompt', style: { top: '66%' } },
        { type: 'source', position: Position.Right, id: 'response' },
      ]}
    />
  );
};
