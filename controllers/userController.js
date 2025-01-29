const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

require('dotenv').config;

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }); // search

    if (!user) {
      return res.status(400).json({ message: 'User not found!' });
    }

    const isMatch = await bcrypt.compare(password, user.password); // compare pass
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  const { username, password, email, phoneNumber, gender } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email, phoneNumber, gender });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // if (error.code === 11000) {
    //   // return res.status(400).json({ error: `${Object.keys(error.keyPattern)} already exists` });
    //   const errorFields = Object.keys(error.keyPattern);
    //   const errorMessage = errorFields.reduce((errors, field) => {
    //     errors[field] = `${field} already exists`;
    //     return errors;
    //   }, {});

    //   return res.status(400).json({ error });
    // }
    res.status(500).json({ error });
  }
};

exports.updateProfile = async (req, res) => {
  const { userId, username, email, phoneNumber, password } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, {
      username,
      email,
      phoneNumber,
      password
    }, {
      new: true
    });

    res.status(200).json({ ...user.toObject(), message: 'Update Successfull' });
  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({ error: `${Object.keys(error.keyPattern)} already exists` });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    const stuCount = students.length;
    res.status(200).json({ students, stuCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserbyId = async (req, res) => {
  const id = req.user.userId;
  try {
    const students = await User.findOne({ _id: id });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserFromToken = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};