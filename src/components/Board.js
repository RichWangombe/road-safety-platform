import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './Column';

const Board = ({ columns, onTaskMove, onTaskAdd }) => {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const taskId = active.id.toString();
    const sourceColumnId = active.data.current?.columnId;
    const destinationColumnId = over?.data.current?.columnId || over.id.toString();

    if (sourceColumnId && destinationColumnId && sourceColumnId !== destinationColumnId) {
      onTaskMove(taskId, sourceColumnId, destinationColumnId);
    }
  };

  return (
    <div className="board" style={{ 
      display: 'flex',
      overflowX: 'auto',
      padding: '16px',
      height: 'calc(100vh - 64px)'
    }}>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={columns.map(col => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          {columns.map(column => (
            <Column 
              key={column.id} 
              column={column}
              onTaskAdd={onTaskAdd}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Board;
