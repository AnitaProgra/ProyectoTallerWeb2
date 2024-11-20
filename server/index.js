const express = require('express');
const app = express();
const port = 3000;

// Middleware para manejar JSON
app.use(express.json());

// Datos en memoria para almacenar las tareas
let tareas = [];
let idCounter = 1; // Contador para asignar IDs únicos

// Crear una nueva tarea
app.post('/api/tareas', (req, res) => {
  const { titulo, descripcion } = req.body;
  const nuevaTarea = { id: idCounter++, titulo, descripcion, completada: false };
  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

// Leer todas las tareas
app.get('/api/tareas', (req, res) => {
  res.json(tareas);
});

// Actualizar una tarea existente
app.put('/api/tareas/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, completada } = req.body;
  const tarea = tareas.find(t => t.id === parseInt(id));

  if (tarea) {
    tarea.titulo = titulo || tarea.titulo;
    tarea.descripcion = descripcion || tarea.descripcion;
    tarea.completada = completada !== undefined ? completada : tarea.completada;
    res.json(tarea);
  } else {
    res.status(404).json({ message: 'Tarea no encontrada' });
  }
});

// Eliminar una tarea
app.delete('/api/tareas/:id', (req, res) => {
  const { id } = req.params;
  const index = tareas.findIndex(t => t.id === parseInt(id));

  if (index !== -1) {
    const [tareaEliminada] = tareas.splice(index, 1);
    res.json(tareaEliminada);
  } else {
    res.status(404).json({ message: 'Tarea no encontrada' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});