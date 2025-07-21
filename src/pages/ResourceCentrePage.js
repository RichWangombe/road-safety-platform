import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  InputBase,
  IconButton,
  Paper,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  UploadFile as UploadFileIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  OndemandVideo as VideoIcon,
  Book as GuideIcon
} from '@mui/icons-material';

// Mock Data
const mockResources = [
  {
    id: 1,
    title: 'National Road Safety Strategy 2021-2030',
    description: 'The official government strategy document outlining key objectives and action plans.',
    category: 'Official Documents',
    type: 'PDF',
    dateAdded: '2023-01-15',
    icon: <PdfIcon color="error" />
  },
  {
    id: 2,
    title: 'Defensive Driving Techniques',
    description: 'A comprehensive video tutorial on best practices for defensive driving.',
    category: 'Training Materials',
    type: 'Video',
    dateAdded: '2023-02-20',
    icon: <VideoIcon color="secondary" />
  },
  {
    id: 3,
    title: 'Incident Reporting Form',
    description: 'Standard template for reporting road safety incidents. Please download and fill.',
    category: 'Forms & Templates',
    type: 'DOC',
    dateAdded: '2023-03-10',
    icon: <DocIcon color="primary" />
  },
  {
    id: 4,
    title: 'Guide to School Zone Safety Audits',
    description: 'A step-by-step guide for conducting safety audits in school zones.',
    category: 'Guidelines',
    type: 'Guide',
    dateAdded: '2023-04-05',
    icon: <GuideIcon sx={{ color: '#FFC107' }} />
  },
  {
    id: 5,
    title: 'Annual Performance Report 2022',
    description: 'A detailed report on the performance and outcomes of all road safety programs in 2022.',
    category: 'Official Documents',
    type: 'PDF',
    dateAdded: '2023-05-25',
    icon: <PdfIcon color="error" />
  },
  {
    id: 6,
    title: 'Community Engagement Toolkit',
    description: 'Resources and templates for running effective community engagement sessions.',
    category: 'Guidelines',
    type: 'DOC',
    dateAdded: '2023-06-18',
    icon: <DocIcon color="primary" />
  }
];

const categories = ['All', 'Official Documents', 'Training Materials', 'Forms & Templates', 'Guidelines'];

export default function ResourceCentrePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredResources = useMemo(() => {
    return mockResources.filter(resource => {
      const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>Resource Centre</Typography>
        <Button variant="contained" startIcon={<UploadFileIcon />}>Upload New Resource</Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            {categories.map(category => (
              <Tab key={category} label={category} value={category} />
            ))}
          </Tabs>
          <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Resources..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {filteredResources.map(resource => (
          <Grid item key={resource.id} xs={12} sm={6} md={4}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {resource.icon}
                  <Typography variant="h6" component="div" sx={{ ml: 2 }}>
                    {resource.title}
                  </Typography>
                </Box>
                <Chip label={resource.category} size="small" sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  {resource.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">View</Button>
                <Button size="small">Download</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredResources.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h6">No resources found</Typography>
            <Typography color="text.secondary">Try adjusting your search or filter settings.</Typography>
        </Box>
      )}
    </Box>
  );
}

