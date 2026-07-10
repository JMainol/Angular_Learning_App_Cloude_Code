export interface Perfil {
  id: number;
  nombre: string;
  rol: string;
  email: string;
  bio: string;
  skills: string[];
  /** Iniciales para el avatar generado por CSS, sin imagen externa. */
  iniciales: string;
  /** Índice de color (0-3) para variar el acento del avatar. */
  colorIdx: number;
}

export const PERFILES: Perfil[] = [
  {
    id: 1,
    nombre: 'Ana García',
    rol: 'Frontend Developer',
    email: 'ana.garcia@dev.io',
    bio: 'Especializada en Angular y rendimiento web. Apasionada por la accesibilidad y los sistemas de diseño component-driven.',
    skills: ['Angular', 'TypeScript', 'RxJS', 'Signals', 'CSS'],
    iniciales: 'AG',
    colorIdx: 0,
  },
  {
    id: 2,
    nombre: 'Carlos López',
    rol: 'Backend Engineer',
    email: 'carlos.lopez@dev.io',
    bio: 'Arquitecto de APIs REST y microservicios con Spring Boot y Node.js. Fan del domain-driven design y el Event Sourcing.',
    skills: ['Java', 'Spring Boot', 'Node.js', 'PostgreSQL', 'Docker'],
    iniciales: 'CL',
    colorIdx: 1,
  },
  {
    id: 3,
    nombre: 'María Sánchez',
    rol: 'Full Stack Developer',
    email: 'maria.sanchez@dev.io',
    bio: 'Conecta el frontend Angular con APIs GraphQL. Disfruta con los monorepos y los pipelines de CI/CD robustos.',
    skills: ['Angular', 'GraphQL', 'NestJS', 'Nx', 'Jest'],
    iniciales: 'MS',
    colorIdx: 2,
  },
  {
    id: 4,
    nombre: 'David Torres',
    rol: 'DevOps Engineer',
    email: 'david.torres@dev.io',
    bio: 'Orquesta clústeres Kubernetes y automatiza despliegues. Cree que la infraestructura debe vivir en el repositorio.',
    skills: ['Kubernetes', 'Terraform', 'GitHub Actions', 'AWS', 'Helm'],
    iniciales: 'DT',
    colorIdx: 3,
  },
];
