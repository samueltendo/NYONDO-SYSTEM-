const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    nin: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    phone: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "manager", "attendant"],
    },
  },
  {
    timestamps: true,
  },
);

/* PASSWORD Hashing and salting */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

module.exports = mongoose.model("User", userSchema);

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//     fullname: String,
//     nin: { type: String },
//     phone: { type: String, unique: true },
//     email: { type: String, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ['admin', 'manager', 'attendant'] }
// });

// // --- PASSWORD HASHING
// userSchema.pre('save', async function() {
//     // Only hash the password if it's new or being changed
//     if (!this.isModified('password')) return;

//     try {
//         // 1.  "Salting" (
//         const salt = await bcrypt.genSalt(10);
//         // 2. Hash the password with the salt
//         this.password = await bcrypt.hash(this.password, salt);
//     } catch (err) {
//         throw err;
//     }
// });

// module.exports = mongoose.model('User', userSchema);
