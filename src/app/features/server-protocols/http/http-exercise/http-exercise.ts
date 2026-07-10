import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { PostService } from '../post.service';
import { Post } from '../post.model';

/**
 * Ejercicio 11.1 — CRUD completo con HttpClient.
 *
 * Demuestra las cuatro operaciones REST contra JSONPlaceholder:
 *   GET    → carga inicial con toSignal()
 *   POST   → crear un nuevo post
 *   PUT    → editar un post existente (inline)
 *   DELETE → eliminar un post de la lista
 *
 * Estado reactivo gestionado con Signals; HttpClient queda encapsulado
 * en PostService y el componente solo consume métodos semánticos.
 */
@Component({
  selector: 'app-http-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './http-exercise.html',
  styleUrl: './http-exercise.scss',
})
export class HttpExercise {
  private readonly svc = inject(PostService);

  // toSignal() convierte el Observable del GET en un Signal.
  // initialValue: [] evita Post[] | undefined y permite usar @for sin guardia.
  // La suscripción se cancela automáticamente al destruir el componente.
  // TODO 1: Aquí ya está implementado. Observa cómo toSignal() integra
  //         el Observable de HttpClient en el mundo reactivo de Signals.
  private readonly _posts = signal<Post[]>([]);
  private readonly _initialLoad = toSignal(this.svc.getAll(), { initialValue: [] as Post[] });

  // computed() que une los posts cargados inicialmente con los creados localmente.
  // Cuando _initialLoad() cambia (llegan los datos de red) se recalcula automáticamente.
  readonly posts = computed(() =>
    this._posts().length > 0 ? this._posts() : this._initialLoad()
  );

  // Signals de estado de UI: carga y error son locales al componente.
  readonly loading = signal(false);
  readonly error   = signal<string | null>(null);
  readonly success = signal<string | null>(null);

  // Estado del formulario de creación
  readonly newTitle = signal('');
  readonly newBody  = signal('');

  // Estado de edición inline: null = ninguno en edición
  readonly editingId    = signal<number | null>(null);
  readonly editingTitle = signal('');
  readonly editingBody  = signal('');

  // ── CREATE ────────────────────────────────────────────────────────────
  // TODO 2: Completa createPost().
  //   Pasos:
  //   a) Valida que newTitle() no esté vacío.
  //   b) Llama a svc.create({ userId: 1, title: newTitle(), body: newBody() }).
  //   c) En next(): añade el post a _posts con .update(prev => [post, ...prev])
  //      y limpia el formulario con newTitle.set('') y newBody.set('').
  //   d) En error(): guarda err.message en this.error().
  //   e) En complete(): pon loading en false.
  createPost(): void {
    const title = this.newTitle().trim();
    if (!title) return;
    this.loading.set(true);
    this.error.set(null);
    this.svc.create({ userId: 1, title, body: this.newBody() }).subscribe({
      next: (post) => {
        this._posts.update((prev) => {
          const base = prev.length > 0 ? prev : [...this._initialLoad()];
          return [post, ...base];
        });
        this.newTitle.set('');
        this.newBody.set('');
        this.showSuccess('sections.http.exercise.successCreate');
      },
      error: (err: Error) => this.error.set(err.message),
      complete: () => this.loading.set(false),
    });
  }

  // ── EDIT (abrir edición inline) ───────────────────────────────────────
  startEdit(post: Post): void {
    this.editingId.set(post.id);
    this.editingTitle.set(post.title);
    this.editingBody.set(post.body);
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  // ── UPDATE ────────────────────────────────────────────────────────────
  // TODO 3: Completa saveEdit().
  //   Pasos:
  //   a) Recoge id = editingId() — si es null, sal.
  //   b) Llama a svc.update(id, { userId: 1, title: editingTitle(), body: editingBody() }).
  //   c) En next(): reemplaza el post en _posts con .update() y cierra la edición con editingId.set(null).
  //   d) En error(): guarda err.message.
  //   e) En complete(): pon loading en false.
  saveEdit(): void {
    const id = this.editingId();
    if (id === null) return;
    this.loading.set(true);
    this.error.set(null);
    this.svc.update(id, { userId: 1, title: this.editingTitle(), body: this.editingBody() }).subscribe({
      next: (updated) => {
        this._posts.update((prev) => {
          const base = prev.length > 0 ? prev : [...this._initialLoad()];
          return base.map((p) => (p.id === updated.id ? updated : p));
        });
        this.editingId.set(null);
        this.showSuccess('sections.http.exercise.successUpdate');
      },
      error: (err: Error) => this.error.set(err.message),
      complete: () => this.loading.set(false),
    });
  }

  // ── DELETE ────────────────────────────────────────────────────────────
  // TODO 4: Completa removePost(id).
  //   Pasos:
  //   a) Llama a svc.remove(id).
  //   b) En next(): filtra el post de _posts con .update(prev => prev.filter(...)).
  //   c) En error(): guarda err.message.
  //   d) En complete(): pon loading en false.
  removePost(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.svc.remove(id).subscribe({
      next: () => {
        this._posts.update((prev) => {
          const base = prev.length > 0 ? prev : [...this._initialLoad()];
          return base.filter((p) => p.id !== id);
        });
        this.showSuccess('sections.http.exercise.successDelete');
      },
      error: (err: Error) => this.error.set(err.message),
      complete: () => this.loading.set(false),
    });
  }

  private showSuccess(key: string): void {
    this.success.set(key);
    setTimeout(() => this.success.set(null), 2500);
  }
}
