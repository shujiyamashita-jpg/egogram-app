const express = require('express');
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const dbPath = process.env.NODE_ENV === 'production'
  ? '/data/db.json'
  : path.join(__dirname, 'db.json');
const adapter = new FileSync(dbPath);
const db = low(adapter);

db.defaults({ results: [], nextId: 1 }).write();

const app = express();
app.use(cors());
app.use(express.json());

// Submit result
app.post('/api/results', (req, res) => {
  const { name, email, cp, np, a, fc, ac, rc } = req.body;
  if (!name || [cp, np, a, fc, ac, rc].some(v => v === undefined)) {
    return res.status(400).json({ error: '必須項目が不足しています' });
  }
  const id = db.get('nextId').value();
  const record = {
    id,
    name,
    email: email || null,
    cp, np, a, fc, ac, rc,
    created_at: new Date().toISOString(),
  };
  db.get('results').push(record).write();
  db.set('nextId', id + 1).write();
  res.json({ id });
});

// Get single result
app.get('/api/results/:id', (req, res) => {
  const row = db.get('results').find({ id: Number(req.params.id) }).value();
  if (!row) return res.status(404).json({ error: '見つかりません' });
  res.json(row);
});

// List all results
app.get('/api/results', (req, res) => {
  const rows = db.get('results').value().slice().reverse();
  res.json(rows);
});

// Delete result
app.delete('/api/results/:id', (req, res) => {
  db.get('results').remove({ id: Number(req.params.id) }).write();
  res.json({ ok: true });
});

// CSV export
app.get('/api/export/csv', (req, res) => {
  const rows = db.get('results').value().slice().reverse();
  const header = 'ID,氏名,メール,CP,NP,A,FC,AC,RC,受験日時\n';
  const csv = rows.map(r =>
    `${r.id},"${r.name}","${r.email || ''}",${r.cp},${r.np},${r.a},${r.fc},${r.ac},${r.rc},"${r.created_at}"`
  ).join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="egogram_results.csv"');
  res.send('﻿' + header + csv);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
