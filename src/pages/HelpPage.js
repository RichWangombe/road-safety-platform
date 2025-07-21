import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
  {
    question: 'How do I reset my password?',
    answer: 'You can reset your password from the Settings page under the Security tab. If you are unable to log in, please contact your system administrator.'
  },
  {
    question: 'Where can I find official documents?',
    answer: 'All official documents, training materials, and guides are available in the Resource Centre. You can filter by category to find what you need.'
  },
  {
    question: 'How do I create a new task?',
    answer: 'You can create a new task directly from the Task Board by clicking the "Add Task" button in the relevant column (e.g., To Do).'
  },
  {
    question: 'Who can see the Reporting dashboard?',
    answer: 'Access to the Reporting dashboard is limited to users with \'Supervisor\' or \'Team Lead\' roles to ensure data privacy and relevance.'
  }
];

export default function HelpPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
        Help & Support
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Contact Information</Typography>
        <Typography variant="body1">
          For technical assistance or urgent issues, please contact the IT Help Desk at <Link href="mailto:support@roadsafety.gov">support@roadsafety.gov</Link> or call us at (123) 456-7890.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Frequently Asked Questions (FAQ)</Typography>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`faq-content-${index}`}
              id={`faq-header-${index}`}
            >
              <Typography>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Box>
  );
}
