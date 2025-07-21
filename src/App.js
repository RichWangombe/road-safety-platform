import React, { useState, useCallback, useMemo } from 'react';
import { DndContext } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import Header from './components/Header';
import Board from './components/Board';
import theme from './theme';
import ntsaTheme from './theme/ntsaTheme';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProgramsPage from './pages/ProgramsPage';
import RolesPage from './pages/RolesPage';
import TeamMembersPage from './pages/TeamMembersPage';
import RoadSafetyActorsPage from './pages/RoadSafetyActorsPage';
import ReportingPage from './pages/ReportingPage';
import ResourceCentrePage from './pages/ResourceCentrePage';
import StakeholdersPage from './pages/StakeholdersPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';

// Sample initial data
const initialColumns = [
  {
    id: 'todo',
    title: 'To Do',
    order: 0,
    color: '#2564cf',
    tasks: [
      {
        id: 'task1',
        content: 'Design new dashboard layout',
        completed: false,
        priority: 'high',
        dueDate: '2025-07-20',
        comments: 3,
        attachments: 2,
        progress: 25,
        assignee: {
          name: 'John Doe',
          avatar: null
        },
      },
      {
        id: 'task2',
        content: 'Update project documentation',
        completed: false,
        priority: 'medium',
        dueDate: '2025-07-25',
        comments: 1,
        attachments: 0,
        progress: 0,
        assignee: {
          name: 'Sarah Wilson',
          avatar: null
        },
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    order: 1,
    color: '#ffaa44',
    tasks: [
      {
        id: 'task3',
        content: 'Implement authentication flow',
        completed: false,
        priority: 'high',
        dueDate: '2025-07-18',
        comments: 5,
        attachments: 1,
        progress: 75,
        assignee: {
          name: 'Jane Smith',
          avatar: null
        },
      },
      {
        id: 'task5',
        content: 'Create user management system',
        completed: false,
        priority: 'medium',
        dueDate: '2025-07-22',
        comments: 2,
        attachments: 3,
        progress: 40,
        assignee: {
          name: 'Mike Johnson',
          avatar: null
        },
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    order: 2,
    color: '#00a300',
    tasks: [
      {
        id: 'task4',
        content: 'Setup project repository',
        completed: true,
        priority: 'low',
        dueDate: '2025-07-15',
        comments: 2,
        attachments: 0,
        progress: 100,
        assignee: {
          name: 'Alex Chen',
          avatar: null
        },
      },
      {
        id: 'task6',
        content: 'Configure CI/CD pipeline',
        completed: true,
        priority: 'medium',
        dueDate: '2025-07-16',
        comments: 1,
        attachments: 2,
        progress: 100,
        assignee: {
          name: 'Sarah Wilson',
          avatar: null
        },
      },
    ],
  },
];

function App() {
  const [columns, setColumns] = useState(initialColumns);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle task movement between columns
  const handleTaskMove = useCallback((taskId, sourceColumnId, destinationColumnId) => {
    setColumns(prevColumns => {
      // Find source and destination columns
      const sourceColumnIndex = prevColumns.findIndex(col => col.id === sourceColumnId);
      const destColumnIndex = prevColumns.findIndex(col => col.id === destinationColumnId);
      
      if (sourceColumnIndex === -1 || destColumnIndex === -1) return prevColumns;
      
      const newColumns = [...prevColumns];
      const sourceColumn = { ...newColumns[sourceColumnIndex] };
      const destColumn = { ...newColumns[destColumnIndex] };
      
      // Find the task in the source column
      const taskIndex = sourceColumn.tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) return prevColumns;
      
      // Remove task from source column
      const [movedTask] = sourceColumn.tasks.splice(taskIndex, 1);
      
      // Add task to destination column
      destColumn.tasks = [...destColumn.tasks, movedTask];
      
      // Update the columns array
      newColumns[sourceColumnIndex] = sourceColumn;
      newColumns[destColumnIndex] = destColumn;
      
      return newColumns;
    });
  }, []);

  // Handle task reordering within the same column
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id.toString();
    const overId = over.id.toString();
    
    if (activeId === overId) return;
    
    // Check if we're moving a task within the same column
    const activeColumnId = active.data.current?.columnId;
    const overColumnId = over.data.current?.columnId;
    
    if (activeColumnId && overColumnId && activeColumnId === overColumnId) {
      setColumns(prevColumns => {
        const columnIndex = prevColumns.findIndex(col => col.id === activeColumnId);
        if (columnIndex === -1) return prevColumns;
        
        const newColumns = [...prevColumns];
        const column = { ...newColumns[columnIndex] };
        
        const oldIndex = column.tasks.findIndex(task => task.id === activeId);
        const newIndex = column.tasks.findIndex(task => task.id === overId);
        
        if (oldIndex === -1 || newIndex === -1) return prevColumns;
        
        column.tasks = arrayMove(column.tasks, oldIndex, newIndex);
        newColumns[columnIndex] = column;
        
        return newColumns;
      });
    }
  }, []);

  // Add a new task to a column
  const handleTaskAdd = useCallback((columnId, content) => {
    const newTask = {
      id: `task-${Date.now()}`,
      content,
      completed: false,
      priority: 'none',
      comments: 0,
      attachments: 0,
    };
    
    setColumns(prevColumns => 
      prevColumns.map(column => 
        column.id === columnId
          ? { ...column, tasks: [...column.tasks, newTask] }
          : column
      )
    );
  }, []);

  // Filter tasks based on search query
  const filteredColumns = useMemo(() => {
    if (!searchQuery.trim()) return columns;
    
    const query = searchQuery.toLowerCase();
    
    return columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => 
        task.content.toLowerCase().includes(query) ||
        (task.assignee && task.assignee.toLowerCase().includes(query))
      ),
    }));
  }, [columns, searchQuery]);

  return (
    <ThemeProvider theme={ntsaTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="programs" element={<ProgramsPage />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="team-members" element={<TeamMembersPage />} />
            <Route path="road-safety-actors" element={<RoadSafetyActorsPage />} />
            <Route path="reporting" element={<ReportingPage />} />
            <Route path="resource-centre" element={<ResourceCentrePage />} />
            <Route path="stakeholders" element={<StakeholdersPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="board" element={
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <Header onSearchChange={setSearchQuery} />
                  <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <DndContext onDragEnd={handleDragEnd}>
                      <Board 
                        columns={filteredColumns} 
                        onTaskMove={handleTaskMove}
                        onTaskAdd={handleTaskAdd}
                      />
                    </DndContext>
                  </Box>
                </Box>
              </ThemeProvider>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
