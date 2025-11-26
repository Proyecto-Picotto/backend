const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Score = require('../models/Score');
const User = require('../models/User');

// POST /score - guardar puntaje (body: { time })
router.post('/score', auth, async (req, res) => {
  try {
    const { time } = req.body;
    if (time === undefined || typeof time !== 'number' || time <= 0) {
      return res.status(400).json({ error: 'Campo "time" inválido. Debe ser número mayor a 0.' });
    }

    // validar usuario
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const score = new Score({ userId: user._id, time });
    const saved = await score.save();

    return res.status(201).json({ success: true, score: { id: saved._id, userId: user._id, username: user.username || user.name, time: saved.time, createdAt: saved.createdAt } });
  } catch (err) {
    console.error('Error POST /score:', err);
    return res.status(500).json({ error: 'Error al guardar puntaje' });
  }
});

// GET /ranking - obtener top 10 (menor tiempo = mejor)
router.get('/ranking', auth, async (req, res) => {
  try {
    const top = await Score.find()
      .sort({ time: 1 })
      .limit(10)
      .populate('userId', 'username email');

    const result = top.map(s => ({
      id: s._id,
      username: s.userId ? (s.userId.username || s.userId.name) : 'Desconocido',
      email: s.userId ? s.userId.email : null,
      time: s.time,
      createdAt: s.createdAt
    }));

    return res.json({ success: true, ranking: result });
  } catch (err) {
    console.error('Error GET /ranking:', err);
    return res.status(500).json({ error: 'Error al obtener ranking' });
  }
});

module.exports = router;
