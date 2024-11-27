import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
  
  getNodeID: (type) => {
    const newIDs = {...get().nodeIDs};
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({nodeIDs: newIDs});
    return `${type}-${newIDs[type]}`;
  },
  
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection) => {
    set({
      edges: addEdge({
        ...connection,
        type: 'smoothstep',
        animated: true,
        markerEnd: {
          type: MarkerType.Arrow,
          height: '15px',
          width: '15px',
          color: '#7c69e3'
        },
        style: {
          stroke: '#7c69e3',
          strokeWidth: 2,
          transition: 'stroke 0.3s ease',
        },
      }, get().edges),
    });
  },
  
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }
        return node;
      }),
    });
  },
  
  submitPipeline: async () => {
    const { nodes, edges } = get();
    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      const message = `Pipeline Analysis:
• Number of Nodes: ${data.num_nodes}
• Number of Edges: ${data.num_edges}
• Valid DAG: ${data.is_dag ? 'Yes' : 'No'}

${!data.is_dag ? 'Warning: The pipeline contains cycles and is not a valid DAG!' : 'Pipeline structure is valid.'}`;
      
      alert(message);
    } catch (error) {
      console.error('Error:', error);
      alert('There was a problem with your submission.');
    }
  },
}));