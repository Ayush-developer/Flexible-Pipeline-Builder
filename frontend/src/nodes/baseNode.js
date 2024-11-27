import React, { useEffect, useRef, useState } from 'react';
import { Handle } from 'reactflow';
import './nodes.css';

export const BaseNode = ({ id, nodeType, fields, handles }) => {
    const inputRefs = useRef([]);
    const [dynamicHandles, setDynamicHandles] = useState([]);

    const resizeInput = (index) => {
        const input = inputRefs.current[index];
        if (input) {
            input.style.height = 'auto';
            input.style.height = `${input.scrollHeight}px`;
        }
    };

    const parseVariables = (text) => {
        const regex = /{{\s*(\w+)\s*}}/g;
        let matches;
        const variables = [];
        while ((matches = regex.exec(text)) !== null) {
            variables.push(matches[1]);
        }
        return variables;
    };

    const updateDynamicHandles = (fieldIndex) => {
        const fieldValue = fields[fieldIndex].value;
        const variables = parseVariables(fieldValue);
        
        const newHandles = variables.map((variable, index) => ({
            id: `${id}-var-${variable}`,
            type: 'source',
            position: 'left',
            fieldId: variable,
            label: variable,
            offset: `-${90 - index * 30}px`
        }));

        setDynamicHandles(newHandles);
    };

    const handleFieldChange = (index, e) => {
        fields[index].onChange(e);
        resizeInput(index);
        updateDynamicHandles(index);
    };

    const getLabelStyle = (position) => {
        const baseStyle = {
            fontSize: '12px',
            color: '#666',
            position: 'absolute',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
        };

        switch (position) {
            case 'left':
                return {
                    ...baseStyle,
                    right: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    marginRight: '8px',
                    textAlign: 'right',
                };
            case 'right':
                return {
                    ...baseStyle,
                    left: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    marginLeft: '8px',
                    textAlign: 'left',
                };
            case 'top':
                return {
                    ...baseStyle,
                    bottom: '100%',
                    left: '60%',
                    transform: 'translateX(-50%)',
                    marginBottom: '8px',
                    textAlign: 'center',
                };
            default:
                return baseStyle;
        }
    };

    const getFieldValue = (fieldId) => {
        const field = fields.find(f => f.id === fieldId);
        return field ? field.value : '';
    };

    return (
        <div className="base-node">
            <div className="node-header">
                <span>{nodeType}</span>
            </div>
            <div className="node-fields">
                {fields.map((field, index) => (
                    <label key={index} className="node-field">
                        <span className="node-label">{field.label}</span>
                        {field.type === 'select' ? (
                            <select value={field.value} onChange={field.onChange}>
                                {field.options.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        ) : (
                            <textarea
                                ref={(el) => (inputRefs.current[index] = el)}
                                value={field.value}
                                onChange={(e) => handleFieldChange(index, e)}
                                className="input-field"
                            />
                        )}
                    </label>
                ))}
            </div>
            <div className="node-handles">
                {nodeType !== 'Text' && handles.map((handle, index) => (
                    <div key={index} className="handle-wrapper">
                        <Handle
                            type={handle.type}
                            position={handle.position}
                            id={`${id}-${handle.id}`}
                            style={{ 
                                backgroundColor: '#7c69e3', 
                                borderRadius: '50%', 
                                width: '10px', 
                                height: '10px',
                                zIndex: 1
                            }}
                        />
                        <span style={getLabelStyle(handle.position)}>
                            {getFieldValue(handle.fieldId)}
                        </span>
                    </div>
                ))}
                {dynamicHandles.map((handle, index) => (
                    <div key={handle.id} className="handle-wrapper" style={{ position: "relative", top: handle.offset }}>
                        <Handle
                            type={handle.type}
                            position={handle.position}
                            id={handle.id}
                            style={{ 
                                backgroundColor: '#7c69e3', 
                                borderRadius: '50%', 
                                width: '10px', 
                                height: '10px',
                                zIndex: 1
                            }}
                        />
                        <span style={{ ...getLabelStyle('left'), marginLeft: "5px" }}>
                            {handle.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
