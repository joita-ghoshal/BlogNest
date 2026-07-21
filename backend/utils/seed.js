const User = require('../models/User');

const seedDemoAccounts = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@blognest.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@blognest.com',
        password: 'admin123',
        role: 'admin',
        bio: 'BlogNest Administrator',
      });
      console.log('Demo admin account created: admin@blognest.com / admin123');
    }

    const userExists = await User.findOne({ email: 'user@blognest.com' });
    if (!userExists) {
      await User.create({
        name: 'Demo User',
        email: 'user@blognest.com',
        password: 'user123456',
        role: 'user',
        bio: 'A passionate writer and reader.',
      });
      console.log('Demo user account created: user@blognest.com / user123456');
    }
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};

module.exports = seedDemoAccounts;
