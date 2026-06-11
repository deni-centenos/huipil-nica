import type { Category, Product } from '../types'

export const negocio = {
  nombre: 'Huipil Nica',
  slogan: 'Tradición, cultura y elegancia nicaragüense',
  descripcion:
    'Catálogo artesanal de trajes típicos, huipiles, máscaras y accesorios para venta y alquiler.',
  whatsapp: '50588888888',
  telefono: '8888-8888',
  direccion: 'Estelí, Nicaragua',
  horario: 'Lunes a sábado, 8:00 AM - 5:00 PM',
  facebook: '#',
  instagram: '#',
}

export const categorias: Category[] = [
  {
    id: 1,
    nombre: 'Damas',
    slug: 'damas',
    descripcion: 'Trajes típicos y huipiles para damas.',
  },
  {
    id: 2,
    nombre: 'Caballeros',
    slug: 'caballeros',
    descripcion: 'Trajes folclóricos para caballeros.',
  },
  {
    id: 3,
    nombre: 'Niños',
    slug: 'ninos',
    descripcion: 'Trajes típicos para niños y niñas.',
  },
  {
    id: 4,
    nombre: 'Máscaras',
    slug: 'mascaras',
    descripcion: 'Máscaras tradicionales y artesanales.',
  },
]

export const productos: Product[] = [
  {
    id: 1,
    categoriaId: 1,
    nombre: 'Traje de Mestizaje',
    slug: 'traje-de-mestizaje',
    descripcionCorta: 'Traje tradicional para presentaciones culturales.',
    descripcionLarga:
      'Traje típico inspirado en la cultura nicaragüense, ideal para bailes folclóricos, actos escolares, eventos culturales y presentaciones especiales.',
    precioVenta: 750,
    precioRenta: 360,
    permiteVenta: true,
    permiteRenta: true,
    imagenPrincipal:
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=900&auto=format&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop',
    ],
    estado: 'DISPONIBLE',
    destacado: true,
    activo: true,
  },
  {
    id: 2,
    categoriaId: 2,
    nombre: 'Traje Folclórico Caballero',
    slug: 'traje-folclorico-caballero',
    descripcionCorta: 'Conjunto tradicional para caballero.',
    descripcionLarga:
      'Conjunto diseñado para bailes tradicionales, actos culturales y actividades patrias. Incluye detalles artesanales inspirados en la vestimenta típica.',
    precioVenta: 700,
    precioRenta: 320,
    permiteVenta: true,
    permiteRenta: true,
    imagenPrincipal:
      'https://images.unsplash.com/photo-1506629905607-d9b1b2e3d0d3?q=80&w=900&auto=format&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1506629905607-d9b1b2e3d0d3?q=80&w=900&auto=format&fit=crop',
    ],
    estado: 'DISPONIBLE',
    destacado: true,
    activo: true,
  },
  {
    id: 3,
    categoriaId: 3,
    nombre: 'Traje Típico Infantil',
    slug: 'traje-tipico-infantil',
    descripcionCorta: 'Traje cómodo y colorido para niños.',
    descripcionLarga:
      'Traje típico infantil para presentaciones escolares, bailes culturales y celebraciones patrias. Elaborado con colores vivos y detalles tradicionales.',
    precioVenta: 520,
    precioRenta: 250,
    permiteVenta: true,
    permiteRenta: true,
    imagenPrincipal:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=900&auto=format&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=900&auto=format&fit=crop',
    ],
    estado: 'DISPONIBLE',
    destacado: false,
    activo: true,
  },
  {
    id: 4,
    categoriaId: 4,
    nombre: 'Máscara Tradicional',
    slug: 'mascara-tradicional',
    descripcionCorta: 'Máscara artesanal para danzas tradicionales.',
    descripcionLarga:
      'Máscara elaborada artesanalmente, ideal para presentaciones folclóricas, danzas tradicionales y decoración cultural.',
    precioVenta: 450,
    precioRenta: 180,
    permiteVenta: true,
    permiteRenta: true,
    imagenPrincipal:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=900&auto=format&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=900&auto=format&fit=crop',
    ],
    estado: 'POR_ENCARGO',
    destacado: false,
    activo: true,
  },
]