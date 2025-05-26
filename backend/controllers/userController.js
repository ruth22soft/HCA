import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const updateAccountStatus = async (req, res) => {
  try {
    const { email, accountStatus } = req.body;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    if (!email || !accountStatus) {
      return res.status(400).json({ message: 'Email and account status are required.' });
    }
    const user = await User.findOneAndUpdate(
      { email },
      { accountStatus },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({
      message: `Account ${accountStatus} successfully.`,
      user: {
        email: user.email,
        accountStatus: user.accountStatus
      }
    });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ 
      message: 'Server error.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getAllUsers = async (req, res) => {
  console.log('getAllUsers called');
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.search || '';

    console.log('About to query users...');
    
    // Build the query
    const query = {};
    if (searchTerm) {
      query.$or = [
        { fullName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { role: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Use lean() for better performance and only select needed fields
    const [users, total] = await Promise.all([
      User.find(query, 'fullName email role accountStatus createdAt')
        .lean()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(query)
    ]);

    console.log('Users fetched:', users.length);
    res.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ 
      message: 'Server error.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const { fullName, email, role, accountStatus } = req.body;
    const update = { fullName, email, role, accountStatus };
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'User updated successfully.', user });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getUserStats = async (req, res) => {
  try {
    // Only admin can access
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Aggregate stats
    const [totalUsers, activatedAccounts, totalAdmins, totalPhysicians, totalPatients] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ accountStatus: 'active' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'physician' }),
      User.countDocuments({ role: 'patient' })
    ]);

    const userTypeDistribution = {
      admin: totalAdmins,
      physician: totalPhysicians,
      patient: totalPatients
    };

    res.json({
      totalUsers,
      activatedAccounts,
      totalAdmins,
      totalPhysicians,
      totalPatients,
      userTypeDistribution
    });
  } catch (err) {
    console.error('Get user stats error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
}; 