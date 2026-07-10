/** Modelo de un post devuelto por JSONPlaceholder. */
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

/** Payload para crear o actualizar un post (sin id). */
export type PostPayload = Omit<Post, 'id'>;
