import React, { useState, useMemo } from 'react';
import { resourcesData } from '../data/mockData';
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

    const getIconForType = (type) => {
    switch (type) {
      case 'PDF':
        return <PdfIcon color="error" />;
      case 'Video':
        return <VideoIcon color="secondary" />;
      case 'DOC':
        return <DocIcon color="primary" />;
      case 'Guide':
        return <GuideIcon sx={{ color: '#FFC107' }} />;
      default:
        return <DocIcon />;
    }
  };

  const filteredResources = useMemo(() => {
    return resourcesData.filter(resource => {
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
                  {getIconForType(resource.type)}
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

