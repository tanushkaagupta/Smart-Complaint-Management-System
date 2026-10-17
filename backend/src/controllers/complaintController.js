import { storage } from '../db/storage.js';

export const getAllComplaints = (req, res) => {
  try {
    const { search, status, priority, category, sortBy, order = 'desc', page, limit } = req.query;
    let complaints = storage.getComplaints();

    // Filtering
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      complaints = complaints.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.issue.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.reporter.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'All') {
      complaints = complaints.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }

    if (priority && priority !== 'All') {
      complaints = complaints.filter(c => c.priority.toLowerCase() === priority.toLowerCase());
    }

    if (category && category !== 'All') {
      complaints = complaints.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }

    // Sorting
    if (sortBy) {
      complaints.sort((a, b) => {
        let valA = a[sortBy] || '';
        let valB = b[sortBy] || '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const total = complaints.length;

    // Pagination (if requested)
    if (page && limit) {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedComplaints = complaints.slice(startIndex, startIndex + limitNum);

      return res.status(200).json({
        success: true,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        limit: limitNum,
        data: paginatedComplaints
      });
    }

    return res.status(200).json({
      success: true,
      total,
      data: complaints
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve complaints',
      error: err.message
    });
  }
};

export const getComplaintById = (req, res) => {
  try {
    const { id } = req.params;
    const complaint = storage.getComplaintById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint with id "${id}" not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve complaint',
      error: err.message
    });
  }
};

export const createComplaint = (req, res) => {
  try {
    const { issue, category, description, location, priority, reporter, email } = req.body;

    if (!issue || !issue.trim()) {
      return res.status(400).json({ success: false, message: 'Issue title is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Description is required' });
    }
    if (!location || !location.trim()) {
      return res.status(400).json({ success: false, message: 'Location is required' });
    }
    if (!reporter || !reporter.trim()) {
      return res.status(400).json({ success: false, message: 'Reporter name is required' });
    }

    const validPriorities = ['High', 'Medium', 'Low'];
    const assignedPriority = validPriorities.includes(priority) ? priority : 'Medium';

    const newComplaint = storage.createComplaint({
      issue: issue.trim(),
      category: category || 'Maintenance',
      description: description.trim(),
      location: location.trim(),
      priority: assignedPriority,
      reporter: reporter.trim(),
      email: email ? email.trim() : undefined
    });

    return res.status(201).json({
      success: true,
      message: 'Complaint registered successfully',
      data: newComplaint
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create complaint',
      error: err.message
    });
  }
};

export const updateComplaintStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = storage.updateComplaint(id, { status });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Complaint with id "${id}" not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: updated
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update complaint status',
      error: err.message
    });
  }
};

export const updateComplaint = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = storage.updateComplaint(id, updates);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Complaint with id "${id}" not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: updated
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update complaint',
      error: err.message
    });
  }
};

export const deleteComplaint = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = storage.deleteComplaint(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Complaint with id "${id}" not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Complaint "${id}" deleted successfully`
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete complaint',
      error: err.message
    });
  }
};
