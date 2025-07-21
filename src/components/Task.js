import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Tooltip
} from '@mui/material';
import { 
  CalendarToday, 
  MoreVert, 
  Edit, 
  Delete, 
  AttachFile,
  Comment
} from '@mui/icons-material';

const Task = ({ task }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.8 : 1,
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return { bg: '#ffebee', border: '#f44336', text: '#d32f2f' };
      case 'medium': return { bg: '#fff3e0', border: '#ff9800', text: '#f57c00' };
      case 'low': return { bg: '#e8f5e8', border: '#4caf50', text: '#388e3c' };
      default: return { bg: '#f5f5f5', border: '#9e9e9e', text: '#616161' };
    }
  };

  const priorityColors = getPriorityColor(task.priority);
  const progress = task.progress || 0;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        sx={{
          mb: 1.5,
          cursor: 'grab',
          borderLeft: `4px solid ${priorityColors.border}`,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            cursor: 'grabbing',
          },
          backgroundColor: isDragging ? '#f5f5f5' : 'white',
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          {/* Header with title and actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 500,
                flex: 1,
                mr: 1,
                color: task.completed ? 'text.secondary' : 'text.primary',
                textDecoration: task.completed ? 'line-through' : 'none'
              }}
            >
              {task.content}
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleMenuOpen}
              sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>
          
          {/* Progress bar */}
          {progress > 0 && (
            <Box sx={{ mb: 1.5 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 4, 
                  borderRadius: 2,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: priorityColors.border
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {progress}% complete
              </Typography>
            </Box>
          )}
          
          {/* Priority and Due Date */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Chip
              label={task.priority || 'Normal'}
              size="small"
              sx={{
                backgroundColor: priorityColors.bg,
                color: priorityColors.text,
                border: `1px solid ${priorityColors.border}`,
                fontSize: '0.7rem',
                fontWeight: 500,
              }}
            />
            {task.dueDate && (
              <Tooltip title={isOverdue ? 'Overdue!' : 'Due date'}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: isOverdue ? 'error.main' : 'text.secondary',
                  backgroundColor: isOverdue ? 'error.light' : 'transparent',
                  px: isOverdue ? 1 : 0,
                  py: isOverdue ? 0.5 : 0,
                  borderRadius: 1
                }}>
                  <CalendarToday sx={{ fontSize: 14, mr: 0.5 }} />
                  <Typography variant="caption" fontWeight={isOverdue ? 500 : 400}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Tooltip>
            )}
          </Box>
          
          {/* Footer with assignee and metadata */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {task.assignee && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{ 
                    width: 28, 
                    height: 28, 
                    mr: 1, 
                    fontSize: '0.8rem',
                    bgcolor: priorityColors.border
                  }}
                  src={task.assignee.avatar}
                >
                  {task.assignee.name?.charAt(0) || 'U'}
                </Avatar>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {task.assignee.name}
                </Typography>
              </Box>
            )}
            
            {/* Task metadata icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {task.attachments > 0 && (
                <Tooltip title={`${task.attachments} attachments`}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <AttachFile sx={{ fontSize: 14 }} />
                    <Typography variant="caption" sx={{ ml: 0.25 }}>
                      {task.attachments}
                    </Typography>
                  </Box>
                </Tooltip>
              )}
              {task.comments > 0 && (
                <Tooltip title={`${task.comments} comments`}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <Comment sx={{ fontSize: 14 }} />
                    <Typography variant="caption" sx={{ ml: 0.25 }}>
                      {task.comments}
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleMenuClose}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit Task
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete Task
        </MenuItem>
      </Menu>
    </>
  );
};

export default Task;
