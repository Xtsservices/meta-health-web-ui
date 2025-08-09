import React from 'react';
import { Container, Typography, Link, Box, Divider } from '@mui/material';

const TermsOfService: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ padding: '20px', bgcolor: '#f5f5f5', borderRadius: '8px' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
        Terms of Use
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ mb: 3, lineHeight: 1.6 }}>
        These Terms of Use ("Terms") govern your use of the Hospital Management System (HMS) provided by Yantram Medtech Pvt Ltd ("we," "us," "our"). By accessing or using the HMS, you agree to be bound by these Terms.
      </Typography>
      
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        User Responsibilities
      </Typography>
      <Box component="ol" sx={{ pl: 3, mb: 3 }}>
        <Typography variant="body1" component="li" sx={{ mb: 1 }}>
          <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
        </Typography>
        <Typography variant="body1" component="li" sx={{ mb: 1 }}>
          <strong>Compliance:</strong> You agree to comply with all applicable laws and regulations when using the HMS.
        </Typography>
        <Typography variant="body1" component="li" sx={{ mb: 1 }}>
          <strong>Prohibited Activities:</strong> You agree not to use the HMS for any unlawful or unauthorized purpose.
        </Typography>
      </Box>
      
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        Intellectual Property
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        All content and materials available on the HMS, including but not limited to text, graphics, and software, are the property of Yantram Medtech Pvt Ltd or its licensors and are protected by intellectual property laws.
      </Typography>
      
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        Disclaimers
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        The HMS is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the HMS will be uninterrupted or error-free.
      </Typography>
      
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        Limitation of Liability
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        To the fullest extent permitted by law, Yantram Medtech Pvt Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, arising from your use of the HMS.
      </Typography>
      
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        Governing Law
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction].
      </Typography>
      
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        Changes to These Terms
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on our HMS.
      </Typography>
      
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        Contact Us
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        If you have any questions about these Terms, please contact us at: <Link href="mailto:Yanta556gmail.com" color="primary">Yanta556gmail.com</Link>, and Telephone <Link href="tel:+58889999" color="primary">+58889999</Link>
      </Typography>
      
      <Divider sx={{ my: 3 }} />
    </Container>
  );
};

export default TermsOfService;
