// toolbar.js

import { DraggableNode } from './draggableNode';
import './index.css'

export const PipelineToolbar = () => {

    return (
        <div style={{ padding: '10px' }}className="menu" >
            <h1 > VectorShift</h1>
            <div style={{ marginTop: '0px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}className="menubar" >
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
            </div>
        </div>
    );
};
