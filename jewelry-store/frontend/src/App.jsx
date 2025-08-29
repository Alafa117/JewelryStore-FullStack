// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Colecciones from './pages/Colecciones.jsx'   // nueva página
import Anillos from './pages/Anillos.jsx'
import Collares from './pages/Collares.jsx'
import Pendientes from './pages/Pendientes.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import DebugPanel from './components/DebugPanel.jsx'

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/colecciones" element={<Colecciones />} />
          <Route path="/anillos" element={<Anillos />} />
          <Route path="/collares" element={<Collares />} />
          <Route path="/pendientes" element={<Pendientes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div style={{ padding: 20 }}>
                  <h2>Dashboard</h2>
                  <p>Área privada (ejemplo).</p>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>

        {import.meta.env.DEV && <DebugPanel />}
      </main>
    </Router>
  )
}
