const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Importar el middleware CORS
const app = express();

app.use(express.json()); // Middleware para manejar JSON en las solicitudes
app.use(cors()); // Habilitar CORS para todas las solicitudes

// Crear o abrir la base de datos SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');

    // Crear la tabla "tareas" si no existe
    db.run(
      `CREATE TABLE IF NOT EXISTS tareas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        completada INTEGER DEFAULT 0
      )`,
      (err) => {
        if (err) {
          console.error('Error al crear la tabla "tareas":', err.message);
        } else {
          console.log('Tabla "tareas" asegurada en la base de datos.');
        }
      }
    );
  }
});

// Endpoint para obtener todas las tareas
app.get('/api/tareas', (req, res) => {
  console.log('Solicitud para obtener todas las tareas');
  db.all('SELECT * FROM tareas', [], (err, rows) => {
    if (err) {
      console.error('Error al obtener tareas:', err.message);
      res.status(500).json({ error: 'Error al obtener tareas' });
    } else {
      console.log('Tareas obtenidas:', rows);
      res.json(rows);
    }
  });
});

// Endpoint para agregar una nueva tarea
app.post('/api/tareas', (req, res) => {
  console.log('Solicitud para agregar tarea:', req.body);
  const { titulo, descripcion, completada } = req.body;

  if (!titulo) {
    console.error('Error: El título es obligatorio.');
    return res.status(400).json({ error: 'El título es obligatorio.' });
  }

  const query = `INSERT INTO tareas (titulo, descripcion, completada) VALUES (?, ?, ?)`;
  db.run(query, [titulo, descripcion, completada ? 1 : 0], function (err) {
    if (err) {
      console.error('Error al agregar tarea:', err.message);
      res.status(500).json({ error: 'Error al agregar tarea' });
    } else {
      console.log('Tarea agregada con ID:', this.lastID);
      res.json({ id: this.lastID, titulo, descripcion, completada });
    }
  });
});

// Endpoint para actualizar una tarea
app.put('/api/tareas/:id', (req, res) => {
  console.log('Solicitud para actualizar tarea:', req.body);
  const { id } = req.params;
  const { titulo, descripcion, completada } = req.body;

  const query = `UPDATE tareas SET titulo = ?, descripcion = ?, completada = ? WHERE id = ?`;
  db.run(query, [titulo, descripcion, completada ? 1 : 0, id], function (err) {
    if (err) {
      console.error('Error al actualizar tarea:', err.message);
      res.status(500).json({ error: 'Error al actualizar tarea' });
    } else if (this.changes === 0) {
      console.warn('Advertencia: Tarea no encontrada para actualizar.');
      res.status(404).json({ message: 'Tarea no encontrada' });
    } else {
      console.log('Tarea actualizada con ID:', id);
      res.json({ id, titulo, descripcion, completada });
    }
  });
});

// Endpoint para eliminar una tarea
app.delete('/api/tareas/:id', (req, res) => {
  console.log('Solicitud para eliminar tarea con ID:', req.params.id);
  const { id } = req.params;

  const query = `DELETE FROM tareas WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      console.error('Error al eliminar tarea:', err.message);
      res.status(500).json({ error: 'Error al eliminar tarea' });
    } else if (this.changes === 0) {
      console.warn('Advertencia: Tarea no encontrada para eliminar.');
      res.status(404).json({ message: 'Tarea no encontrada' });
    } else {
      console.log('Tarea eliminada con ID:', id);
      res.json({ message: 'Tarea eliminada correctamente' });
    }
  });
});

// Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
