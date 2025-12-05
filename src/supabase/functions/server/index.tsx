import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from './kv_store.tsx';

const app = new Hono();

// Enable CORS and logging
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Utility function to generate application reference numbers
const generateReferenceNumber = (type: string): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${type.toUpperCase()}-${timestamp}-${random}`;
};

// Utility function to get user ID from authorization header
const getUserFromAuth = async (authHeader: string | undefined) => {
  if (!authHeader) return null;
  
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user;
  } catch (error) {
    console.log('Auth error:', error);
    return null;
  }
};

// Health check endpoint
app.get('/make-server-8ee81f4f/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== APPLICATION SUBMISSION ENDPOINTS ====================

// Submit passport application
app.post('/make-server-8ee81f4f/applications/passport', async (c) => {
  try {
    const formData = await c.req.json();
    const referenceNumber = generateReferenceNumber('PASS');
    
    const application = {
      id: referenceNumber,
      type: 'passport',
      status: 'submitted',
      formData,
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      statusHistory: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          note: 'Application submitted successfully'
        }
      ]
    };

    await kv.set(`application:${referenceNumber}`, JSON.stringify(application));
    await kv.set(`user_applications:${formData.email}:${referenceNumber}`, JSON.stringify({
      refNumber: referenceNumber,
      type: 'passport',
      status: 'submitted',
      submittedAt: application.submittedAt
    }));

    console.log(`Passport application submitted: ${referenceNumber}`);

    return c.json({
      success: true,
      referenceNumber,
      message: 'Passport application submitted successfully',
      estimatedProcessingTime: '10-15 business days'
    });
  } catch (error) {
    console.log('Error submitting passport application:', error);
    return c.json({ error: 'Failed to submit application' }, 500);
  }
});

// Submit visa application
app.post('/make-server-8ee81f4f/applications/visa', async (c) => {
  try {
    const formData = await c.req.json();
    const referenceNumber = generateReferenceNumber('VISA');
    
    const application = {
      id: referenceNumber,
      type: 'visa',
      status: 'submitted',
      formData,
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      statusHistory: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          note: 'Visa application submitted successfully'
        }
      ]
    };

    await kv.set(`application:${referenceNumber}`, JSON.stringify(application));
    await kv.set(`user_applications:${formData.email}:${referenceNumber}`, JSON.stringify({
      refNumber: referenceNumber,
      type: 'visa',
      status: 'submitted',
      submittedAt: application.submittedAt
    }));

    console.log(`Visa application submitted: ${referenceNumber}`);

    return c.json({
      success: true,
      referenceNumber,
      message: 'Visa application submitted successfully',
      estimatedProcessingTime: '5-10 business days'
    });
  } catch (error) {
    console.log('Error submitting visa application:', error);
    return c.json({ error: 'Failed to submit application' }, 500);
  }
});

// Submit permit application
app.post('/make-server-8ee81f4f/applications/permit', async (c) => {
  try {
    const formData = await c.req.json();
    const referenceNumber = generateReferenceNumber('PERM');
    
    const application = {
      id: referenceNumber,
      type: 'permit',
      status: 'submitted',
      formData,
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      statusHistory: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          note: 'Permit application submitted successfully'
        }
      ]
    };

    await kv.set(`application:${referenceNumber}`, JSON.stringify(application));
    await kv.set(`user_applications:${formData.email}:${referenceNumber}`, JSON.stringify({
      refNumber: referenceNumber,
      type: 'permit',
      status: 'submitted',
      submittedAt: application.submittedAt
    }));

    console.log(`Permit application submitted: ${referenceNumber}`);

    return c.json({
      success: true,
      referenceNumber,
      message: 'Permit application submitted successfully',
      estimatedProcessingTime: '10-15 business days'
    });
  } catch (error) {
    console.log('Error submitting permit application:', error);
    return c.json({ error: 'Failed to submit application' }, 500);
  }
});

// Submit citizenship application
app.post('/make-server-8ee81f4f/applications/citizenship', async (c) => {
  try {
    const formData = await c.req.json();
    const referenceNumber = generateReferenceNumber('CITZ');
    
    const application = {
      id: referenceNumber,
      type: 'citizenship',
      status: 'submitted',
      formData,
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      statusHistory: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          note: 'Citizenship application submitted successfully'
        }
      ]
    };

    await kv.set(`application:${referenceNumber}`, JSON.stringify(application));
    await kv.set(`user_applications:${formData.email}:${referenceNumber}`, JSON.stringify({
      refNumber: referenceNumber,
      type: 'citizenship',
      status: 'submitted',
      submittedAt: application.submittedAt
    }));

    console.log(`Citizenship application submitted: ${referenceNumber}`);

    return c.json({
      success: true,
      referenceNumber,
      message: 'Citizenship application submitted successfully',
      estimatedProcessingTime: '6-12 months'
    });
  } catch (error) {
    console.log('Error submitting citizenship application:', error);
    return c.json({ error: 'Failed to submit application' }, 500);
  }
});

// Submit laissez-passer application
app.post('/make-server-8ee81f4f/applications/laissez-passer', async (c) => {
  try {
    const formData = await c.req.json();
    const referenceNumber = generateReferenceNumber('LP');
    
    const processingTime = formData.isEmergency ? '24-48 hours' : '3-5 business days';
    
    const application = {
      id: referenceNumber,
      type: 'laissez-passer',
      status: 'submitted',
      formData,
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      isEmergency: formData.isEmergency,
      statusHistory: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          note: formData.isEmergency ? 'Emergency application submitted' : 'Application submitted successfully'
        }
      ]
    };

    await kv.set(`application:${referenceNumber}`, JSON.stringify(application));
    await kv.set(`user_applications:${formData.email}:${referenceNumber}`, JSON.stringify({
      refNumber: referenceNumber,
      type: 'laissez-passer',
      status: 'submitted',
      submittedAt: application.submittedAt,
      isEmergency: formData.isEmergency
    }));

    console.log(`Laissez-passer application submitted: ${referenceNumber}`);

    return c.json({
      success: true,
      referenceNumber,
      message: 'Emergency travel document application submitted successfully',
      estimatedProcessingTime: processingTime
    });
  } catch (error) {
    console.log('Error submitting laissez-passer application:', error);
    return c.json({ error: 'Failed to submit application' }, 500);
  }
});

// Submit refugee services request
app.post('/make-server-8ee81f4f/applications/refugee', async (c) => {
  try {
    const formData = await c.req.json();
    const referenceNumber = generateReferenceNumber('REF');
    
    const application = {
      id: referenceNumber,
      type: 'refugee',
      status: 'submitted',
      formData,
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      statusHistory: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          note: 'Refugee service request submitted successfully'
        }
      ]
    };

    await kv.set(`application:${referenceNumber}`, JSON.stringify(application));
    await kv.set(`user_applications:${formData.email}:${referenceNumber}`, JSON.stringify({
      refNumber: referenceNumber,
      type: 'refugee',
      status: 'submitted',
      submittedAt: application.submittedAt
    }));

    console.log(`Refugee services request submitted: ${referenceNumber}`);

    return c.json({
      success: true,
      referenceNumber,
      message: 'Refugee service request submitted successfully',
      nextSteps: 'A case worker will contact you within 48 hours'
    });
  } catch (error) {
    console.log('Error submitting refugee services request:', error);
    return c.json({ error: 'Failed to submit request' }, 500);
  }
});

// Submit diaspora services request
app.post('/make-server-8ee81f4f/applications/diaspora', async (c) => {
  try {
    const formData = await c.req.json();
    const referenceNumber = generateReferenceNumber('DIAS');
    
    const application = {
      id: referenceNumber,
      type: 'diaspora',
      status: 'submitted',
      formData,
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      statusHistory: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          note: 'Diaspora service request submitted successfully'
        }
      ]
    };

    await kv.set(`application:${referenceNumber}`, JSON.stringify(application));
    await kv.set(`user_applications:${formData.email}:${referenceNumber}`, JSON.stringify({
      refNumber: referenceNumber,
      type: 'diaspora',
      status: 'submitted',
      submittedAt: application.submittedAt
    }));

    console.log(`Diaspora services request submitted: ${referenceNumber}`);

    return c.json({
      success: true,
      referenceNumber,
      message: 'Diaspora service request submitted successfully',
      nextSteps: 'Our diaspora team will contact you within 48 hours'
    });
  } catch (error) {
    console.log('Error submitting diaspora services request:', error);
    return c.json({ error: 'Failed to submit request' }, 500);
  }
});

// ==================== APPLICATION STATUS & TRACKING ====================

// Get application status by reference number
app.get('/make-server-8ee81f4f/applications/status/:refNumber', async (c) => {
  try {
    const refNumber = c.req.param('refNumber');
    
    const applicationData = await kv.get(`application:${refNumber}`);
    if (!applicationData) {
      return c.json({ error: 'Application not found' }, 404);
    }

    const application = JSON.parse(applicationData);
    
    return c.json({
      success: true,
      application: {
        referenceNumber: application.id,
        type: application.type,
        status: application.status,
        submittedAt: application.submittedAt,
        lastUpdated: application.lastUpdated,
        statusHistory: application.statusHistory,
        isEmergency: application.isEmergency || false
      }
    });
  } catch (error) {
    console.log('Error fetching application status:', error);
    return c.json({ error: 'Failed to fetch status' }, 500);
  }
});

// Get all applications for a user by email
app.get('/make-server-8ee81f4f/applications/user/:email', async (c) => {
  try {
    const email = c.req.param('email');
    
    const userApplications = await kv.getByPrefix(`user_applications:${email}:`);
    
    const applications = userApplications.map(app => JSON.parse(app.value));
    
    return c.json({
      success: true,
      applications: applications.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      )
    });
  } catch (error) {
    console.log('Error fetching user applications:', error);
    return c.json({ error: 'Failed to fetch applications' }, 500);
  }
});

// Update application status (for admin use)
app.put('/make-server-8ee81f4f/applications/:refNumber/status', async (c) => {
  try {
    const refNumber = c.req.param('refNumber');
    const { status, note } = await c.req.json();
    
    const applicationData = await kv.get(`application:${refNumber}`);
    if (!applicationData) {
      return c.json({ error: 'Application not found' }, 404);
    }

    const application = JSON.parse(applicationData);
    
    // Update application
    application.status = status;
    application.lastUpdated = new Date().toISOString();
    application.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${status}`
    });

    await kv.set(`application:${refNumber}`, JSON.stringify(application));
    
    // Update user application list
    const userApp = await kv.get(`user_applications:${application.formData.email}:${refNumber}`);
    if (userApp) {
      const userAppData = JSON.parse(userApp);
      userAppData.status = status;
      await kv.set(`user_applications:${application.formData.email}:${refNumber}`, JSON.stringify(userAppData));
    }

    console.log(`Application ${refNumber} status updated to ${status}`);

    return c.json({
      success: true,
      message: 'Application status updated successfully'
    });
  } catch (error) {
    console.log('Error updating application status:', error);
    return c.json({ error: 'Failed to update status' }, 500);
  }
});

// ==================== SYSTEM STATISTICS & ANALYTICS ====================

// Get system statistics
app.get('/make-server-8ee81f4f/statistics', async (c) => {
  try {
    const allApplications = await kv.getByPrefix('application:');
    
    const stats = {
      totalApplications: allApplications.length,
      applicationsByType: {},
      applicationsByStatus: {},
      emergencyApplications: 0,
      applicationsToday: 0,
      applicationsThisWeek: 0
    };

    const today = new Date().toDateString();
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    allApplications.forEach(app => {
      const application = JSON.parse(app.value);
      
      // Count by type
      stats.applicationsByType[application.type] = (stats.applicationsByType[application.type] || 0) + 1;
      
      // Count by status
      stats.applicationsByStatus[application.status] = (stats.applicationsByStatus[application.status] || 0) + 1;
      
      // Count emergency applications
      if (application.isEmergency) {
        stats.emergencyApplications++;
      }
      
      // Count today's applications
      const appDate = new Date(application.submittedAt);
      if (appDate.toDateString() === today) {
        stats.applicationsToday++;
      }
      
      // Count this week's applications
      if (appDate >= oneWeekAgo) {
        stats.applicationsThisWeek++;
      }
    });

    return c.json({
      success: true,
      statistics: stats
    });
  } catch (error) {
    console.log('Error fetching statistics:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

// ==================== DOCUMENT MANAGEMENT ====================

// Save document metadata
app.post('/make-server-8ee81f4f/documents', async (c) => {
  try {
    const { applicationRef, documentType, fileName, fileSize, uploadedBy } = await c.req.json();
    
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const document = {
      id: documentId,
      applicationRef,
      documentType,
      fileName,
      fileSize,
      uploadedBy,
      uploadedAt: new Date().toISOString(),
      status: 'uploaded'
    };

    await kv.set(`document:${documentId}`, JSON.stringify(document));
    await kv.set(`app_documents:${applicationRef}:${documentId}`, JSON.stringify(document));

    console.log(`Document uploaded for application ${applicationRef}: ${fileName}`);

    return c.json({
      success: true,
      documentId,
      message: 'Document uploaded successfully'
    });
  } catch (error) {
    console.log('Error saving document metadata:', error);
    return c.json({ error: 'Failed to save document' }, 500);
  }
});

// Get documents for an application
app.get('/make-server-8ee81f4f/applications/:refNumber/documents', async (c) => {
  try {
    const refNumber = c.req.param('refNumber');
    
    const documents = await kv.getByPrefix(`app_documents:${refNumber}:`);
    
    const documentList = documents.map(doc => JSON.parse(doc.value));
    
    return c.json({
      success: true,
      documents: documentList.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )
    });
  } catch (error) {
    console.log('Error fetching documents:', error);
    return c.json({ error: 'Failed to fetch documents' }, 500);
  }
});

// ==================== APPOINTMENT MANAGEMENT ====================

// Book appointment
app.post('/make-server-8ee81f4f/appointments', async (c) => {
  try {
    const appointmentData = await c.req.json();
    const appointmentId = `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const appointment = {
      id: appointmentId,
      ...appointmentData,
      status: 'scheduled',
      bookedAt: new Date().toISOString(),
      confirmationSent: false
    };

    await kv.set(`appointment:${appointmentId}`, JSON.stringify(appointment));
    await kv.set(`user_appointments:${appointmentData.email}:${appointmentId}`, JSON.stringify(appointment));

    console.log(`Appointment booked: ${appointmentId}`);

    return c.json({
      success: true,
      appointmentId,
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.log('Error booking appointment:', error);
    return c.json({ error: 'Failed to book appointment' }, 500);
  }
});

// Get user appointments
app.get('/make-server-8ee81f4f/appointments/user/:email', async (c) => {
  try {
    const email = c.req.param('email');
    
    const appointments = await kv.getByPrefix(`user_appointments:${email}:`);
    
    const appointmentList = appointments.map(apt => JSON.parse(apt.value));
    
    return c.json({
      success: true,
      appointments: appointmentList.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    });
  } catch (error) {
    console.log('Error fetching appointments:', error);
    return c.json({ error: 'Failed to fetch appointments' }, 500);
  }
});

console.log('Border & Immigration Management Server started successfully');

Deno.serve(app.fetch);