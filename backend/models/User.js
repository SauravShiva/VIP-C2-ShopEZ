const mongoose = require('mongoose');

// Define the blueprint for a User
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // Ensures no two users can register with the same email
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['USER', 'ADMIN'], // Only allows these two specific text values
    default: 'USER' 
  }
}, { 
  timestamps: true // Automatically adds 'createdAt' and 'updatedAt' timestamps
});

// Export the model so we can use it in our routes later
module.exports = mongoose.model('User', userSchema);