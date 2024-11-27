from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict
from collections import defaultdict

app = FastAPI()

origins = [
    "http://localhost:3000" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str
    data: Dict
    position: Dict[str, float]
    type: str

class Edge(BaseModel):  
    id: str
    source: str
    target: str
    type: str

class PipelineData(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    graph = defaultdict(list)
    for edge in edges:
        graph[edge.source].append(edge.target)
    
    visited = set()
    temp = set()
    
    def has_cycle(node: str) -> bool:
        if node in temp:
            return True
        if node in visited:
            return False
        
        temp.add(node)
        
        for neighbor in graph[node]:
            if has_cycle(neighbor):
                return True
                
        temp.remove(node)
        visited.add(node)
        return False
    
    node_ids = {node.id for node in nodes}
    for node_id in node_ids:
        if node_id not in visited:
            if has_cycle(node_id):
                return False
    
    return True

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
async def parse_pipeline(pipeline_data: PipelineData):
    num_nodes = len(pipeline_data.nodes)
    num_edges = len(pipeline_data.edges)
    dag_status = is_dag(pipeline_data.nodes, pipeline_data.edges)
    
    return JSONResponse(content={
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': dag_status
    })
