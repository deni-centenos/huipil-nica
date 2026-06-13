import { Route, Routes } from 'react-router-dom'

import { PublicLayout } from './components/public/PublicLayout'
import { HomePage } from './pages/public/HomePage'
import { CatalogPage } from './pages/public/CatalogPage'
import { ProductDetailPage } from './pages/public/ProductDetailPage'
import { BlogPage } from './pages/public/BlogPage'
import { ReviewsPage } from './pages/public/ReviewsPage'
import { AboutPage } from './pages/public/AboutPage'

import { AdminLayout } from './components/admin/AdminLayout'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage'
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage'
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute'
import { AdminConfigPage } from './pages/admin/AdminConfigPage'
import { AdminBlogPage } from './pages/admin/AdminBlogPage'
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage'


function App() {
  return (
    <Routes>
      {/* WEB PÚBLICA */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/producto/:slug" element={<ProductDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/resenas" element={<ReviewsPage />} />
        <Route path="/sobre-nosotros" element={<AboutPage />} />
      </Route>

      {/* LOGIN ADMIN */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* PANEL ADMIN */}
      <Route
  element={
    <AdminProtectedRoute>
      <AdminLayout />
    </AdminProtectedRoute>
  }
>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/productos" element={<AdminProductsPage />} />
        <Route path="/admin/productos/nuevo" element={<AdminProductFormPage />} />
        <Route path="/admin/productos/editar/:id" element={<AdminProductFormPage />} />
        <Route path="/admin/categorias" element={<AdminCategoriesPage />} />
        <Route path="/admin/configuracion" element={<AdminConfigPage />} />

        <Route path="/admin/blog" element={<AdminBlogPage />} />

<Route path="/admin/resenas" element={<AdminReviewsPage />} />
      </Route>
    </Routes>
  )
}

export default App