// inputNode.js

import { useState } from 'react';
// import { Handle, Position } from 'reactflow';

import { BaseNode } from './baseNode';
import { Position } from 'reactflow';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  // const handleNameChange = (e) => {
  //   setCurrName(e.target.value);
  // };

  // const handleTypeChange = (e) => {
  //   setInputType(e.target.value);
  // };

  return (
    <BaseNode 
       id={id}
       nodeType= 'Input'
       fields={[
        { label: 'Name', type: 'text', value: currName, onChange: (e) => setCurrName(e.target.value) },
        { label: 'Type', type: 'select', value: inputType, onChange: (e) => setInputType(e.target.value), options: ['Text', 'File'] },
      ]}
      handles ={[
        {type:'source',position: Position.Right,id:'value'}
      ]}
      />

  )
}