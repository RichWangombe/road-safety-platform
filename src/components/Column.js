import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Task from './Task';
import { Add as AddIcon } from '@mui/icons-material';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  IconButton,
  InputAdornment
} from '@mui/material';

const Column = ({ column, onTaskAdd }) => {
  const [newTaskContent, setNewTaskContent] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAddTask = () => {
    if (newTaskContent.trim()) {
      onTaskAdd(column.id, newTaskContent);
      setNewTaskContent('');
      setIsAddingTask(false);
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={{
        ...style,
        minWidth: '300px',
        maxWidth: '300px',
        marginRight: '16px',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
      }}
      {...attributes}
      {...listeners}
    >
      <Box
        sx={{
          padding: '12px 16px',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: column.color || '#0078d4',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {column.title}
        </Typography>
        <Typography variant="caption">
          {column.tasks.length} tasks
        </Typography>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, padding: '8px', overflowY: 'auto' }}>
        {column.tasks.map((task) => (
          <Task key={task.id} task={task} columnId={column.id} />
        ))}
        
        {isAddingTask ? (
          <Box sx={{ padding: '8px' }}>
            <TextField
              fullWidth
              autoFocus
              variant="outlined"
              size="small"
              placeholder="Enter a title for this task"
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddTask();
                } else if (e.key === 'Escape') {
                  setIsAddingTask(false);
                  setNewTaskContent('');
                }
              }}
              onBlur={() => {
                if (newTaskContent.trim()) {
                  handleAddTask();
                } else {
                  setIsAddingTask(false);
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleAddTask}
                      disabled={!newTaskContent.trim()}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              color: '#666',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                borderRadius: '4px',
              },
            }}
            onClick={() => setIsAddingTask(true)}
          >
            <AddIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">Add a task</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Column;
