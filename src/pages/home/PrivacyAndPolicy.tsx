import React from 'react';
import { Container, Typography, Link, Box, Divider } from '@mui/material';

const PrivacyPolicy: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ padding: '20px', bgcolor: '#f5f5f5', borderRadius: '8px' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
        Privacy Policy
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ mb: 3, lineHeight: 1.6 }}>
        Yantram Medtech Pvt Ltd ("we," "us," "our") is committed to protecting the privacy of your information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Hospital Management System (HMS).
      </Typography>
      
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        Information We Collect
      </Typography>
      <Box component="ol" sx={{ pl: 3, mb: 3 }}>
        <Typography variant="body1" component="li" sx={{ mb: 1 }}>
          <strong>Personal Information:</strong> We may collect personal information such as your name, email address, phone number, and other identifying details.
        </Typography>
        <Typography variant="body1" component="li" sx={{ mb: 1 }}>
          <strong>Health Information:</strong> We collect health-related information necessary for providing medical services, including medical history, treatment records, and diagnostic information.
        </Typography>
        <Typography variant="body1" component="li" sx={{ mb: 1 }}>
          <strong>Usage Data:</strong> Information about your interaction with the HMS, including log data, usage patterns, and device information.
        </Typography>
      </Box>
      
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        How We Use Your Information
      </Typography>
      <Box component="ol" sx={{ pl: 3, mb: 3 }}>
        <Typography variant="body1" component="li" sx={{ mb: 1 }}>
          <strong>Service Delivery:</strong> To provide, maintain, and improve our HMS services.
        </Typography>
        <Typography variant="body1" component="li" sx={{ mb: 1 }}>
          <strong>Communication:</strong> To communicate with you about your use of the HMS, including updates and support.
        </Typography>
        <Typography variant="body1" component="li" sx={{ mb: 1 }}>
          <strong>Compliance:</strong> To comply with legal obligations and protect our legal rights.
        </Typography>
      </Box>
      
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        Information Sharing
      </Typography>
      <Box component="ol" sx={{ pl: 3, mb: 3 }}>
        <Typography variant="body1" component="li" sx={{ mb: 1 }}>
          <strong>With Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf.
        </Typography>
        <Typography variant="body1" component="li" sx={{ mb: 1 }}>
          <strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.
        </Typography>
      </Box>
      
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        Data Security
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, use, or disclosure.
      </Typography>
      
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        Your Rights
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        You have the right to access, correct, or delete your personal information. You may also object to or restrict the processing of your information.
      </Typography>
      
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        Changes to This Policy
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our HMS.
      </Typography>
      
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        Contact Us
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        If you have any questions about this Privacy Policy, please contact us at: <Link href="mailto:Yanta556gmail.com" color="primary">Yanta556gmail.com</Link>, and Telephone <Link href="tel:+58889999" color="primary">+58889999</Link>
      </Typography>
      
      <Divider sx={{ my: 3 }} />
    </Container>
  );
};

export default PrivacyPolicy;
