// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || "replace_with_a_strong_secret";

// -------------------- REGISTER --------------------
router.post('/register', async (req, res) => {
  console.log('POST /register body:', req.body);

  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('Usuario ya existe:', existingUser.username);
      return res.status(400).json({ error: 'Usuario o email ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    console.log('Usuario creado:', user.username);

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ message: 'Usuario creado', user: { username: user.username, email: user.email }, token });
  } catch (err) {
    console.error('Error en register:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// -------------------- LOGIN --------------------
router.post('/login', async (req, res) => {
  console.log('POST /login body:', req.body);

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const user = await User.findOne({ email });
    console.log('DB response:', user);

    if (!user) {
      console.log('Usuario no encontrado con email:', email);
      return res.status(400).json({ error: 'Usuario o contraseña incorrecta' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Contraseña incorrecta para usuario:', email);
      return res.status(400).json({ error: 'Usuario o contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    console.log('Login exitoso:', user.username);

    res.status(200).json({ message: 'Login exitoso', user: { username: user.username, email: user.email }, token });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;
