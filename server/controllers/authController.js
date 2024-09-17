// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/register");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Hash the password for security
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate a JWT token for authentication
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Respond with user info and token
    res.status(201).json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
        token
      }
    });
  } catch (error) {
    console.error(error.message); // Log the error for debugging
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
        token
      }
    });
  }catch (error) {
    console.error(error.message); // Log the error for debugging
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email
        },
        token
      }
    });
  }catch (error) {
    console.error(error.message); // Log the error for debugging
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  user.resetToken = resetToken;
  user.resetTokenExpiration = Date.now() + 3600000; // 1 hour from now
  await user.save();

  // You would implement email sending here with the resetToken
  res.json({ message: 'Check your email for the password reset link', token: resetToken });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  let decoded;
  try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired token' });
  }

  const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ message: 'Invalid token or user does not exist' });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  await user.save();

  res.json({ message: 'Password successfully reset' });
};
