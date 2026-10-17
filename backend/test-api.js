import app from './src/app.js';

const PORT = 5001; // test on 5001 to avoid conflicts
const server = app.listen(PORT, async () => {
  console.log(`Test server running on port ${PORT}`);
  try {
    const baseUrl = `http://localhost:${PORT}/api`;

    // 1. Health check
    console.log('Testing GET /api/health...');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthJson = await healthRes.json();
    console.log('Health check:', healthJson);
    if (healthJson.status !== 'ok') throw new Error('Health check failed');

    // 2. Get complaints
    console.log('Testing GET /api/complaints...');
    const compRes = await fetch(`${baseUrl}/complaints`);
    const compJson = await compRes.json();
    console.log(`Retrieved ${compJson.total} complaints`);
    if (!compJson.success || compJson.total === 0) throw new Error('Get complaints failed');

    // 3. Create a complaint
    console.log('Testing POST /api/complaints...');
    const createRes = await fetch(`${baseUrl}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        issue: 'Automated Test Complaint',
        category: 'Maintenance',
        description: 'Testing the backend API integration.',
        location: 'Lab 101, Test Wing',
        priority: 'High',
        reporter: 'System Tester',
        email: 'tester@example.com'
      })
    });
    const createdJson = await createRes.json();
    console.log('Created complaint:', createdJson.data.id);
    if (!createdJson.success) throw new Error('Create complaint failed');

    // 4. Update status
    console.log(`Testing PATCH /api/complaints/${createdJson.data.id}/status...`);
    const statusRes = await fetch(`${baseUrl}/complaints/${encodeURIComponent(createdJson.data.id)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'In Progress' })
    });
    const statusJson = await statusRes.json();
    console.log('Status updated to:', statusJson.data.status);
    if (statusJson.data.status !== 'In Progress') throw new Error('Status update failed');

    // 5. Get Analytics
    console.log('Testing GET /api/analytics/summary...');
    const analyticsRes = await fetch(`${baseUrl}/analytics/summary`);
    const analyticsJson = await analyticsRes.json();
    console.log('Analytics summary total:', analyticsJson.data.totalComplaints);
    if (!analyticsJson.success) throw new Error('Analytics failed');

    // 6. Delete test complaint
    console.log(`Testing DELETE /api/complaints/${createdJson.data.id}...`);
    const delRes = await fetch(`${baseUrl}/complaints/${encodeURIComponent(createdJson.data.id)}`, {
      method: 'DELETE'
    });
    const delJson = await delRes.json();
    console.log('Deleted result:', delJson.message);
    if (!delJson.success) throw new Error('Delete failed');

    console.log('\n=========================================');
    console.log(' ALL BACKEND API TESTS PASSED! SUCCESS!  ');
    console.log('=========================================\n');
  } catch (err) {
    console.error('Test failed with error:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
