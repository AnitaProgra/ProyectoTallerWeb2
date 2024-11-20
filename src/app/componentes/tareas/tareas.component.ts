import { Component, OnInit } from '@angular/core';
import { TareaService, Tarea } from '../../servicios/tareas.service';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {
  tareas: Tarea[] = [];
  nuevaTarea: Tarea = { titulo: '', descripcion: '', completada: false };
  tareaSeleccionada: Tarea | null = null;

  constructor(private tareaService: TareaService) {}

  ngOnInit() {
    this.obtenerTareas();
  }

  obtenerTareas() {
    this.tareaService.obtenerTareas().subscribe(
      (tareas) => this.tareas = tareas,
      (error) => console.error('Error al obtener tareas:', error)
    );
  }

  agregarTarea() {
    if (this.nuevaTarea.titulo && this.nuevaTarea.descripcion) {
      this.tareaService.agregarTarea(this.nuevaTarea).subscribe(
        (tarea) => {
          this.tareas.push(tarea);
          this.nuevaTarea = { titulo: '', descripcion: '', completada: false };
        },
        (error) => console.error('Error al agregar tarea:', error)
      );
    }
  }

  actualizarTarea(tarea: Tarea) {
    this.tareaService.actualizarTarea(tarea).subscribe(
      () => {
        console.log(`Tarea actualizada: ${tarea.titulo} - Completada: ${tarea.completada}`);
      },
      (error) => console.error('Error al actualizar tarea:', error)
    );
  }

  cerrarModal() {
    this.tareaSeleccionada = null;
  }

  eliminarTarea(tarea: Tarea) {
    this.tareaService.eliminarTarea(tarea.id!).subscribe(
      () => {
        this.tareas = this.tareas.filter(t => t.id !== tarea.id);
      },
      (error) => console.error('Error al eliminar tarea:', error)
    );
  }

  seleccionarTarea(tarea: Tarea) {
    this.tareaSeleccionada = { ...tarea };
  }

  guardarCambios() {
    if (this.tareaSeleccionada) {
      this.actualizarTarea(this.tareaSeleccionada);
      this.tareaSeleccionada = null;
    }
    this.cerrarModal();
  }

  cancelarEdicion() {
    this.tareaSeleccionada = null;
  }
}
