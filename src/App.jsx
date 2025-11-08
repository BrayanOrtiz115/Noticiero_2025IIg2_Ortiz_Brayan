import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Header from './Components/Header/Header'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import Dashboard from './Components/Dashboard/Dashboard'
import News from './Components/News/News'
import NewsDetail from './Components/NewsDetail/NewsDetail'
import { auth, db } from './Firebase/ConfigFirebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

// Importar páginas de categorías
import Home from './Pages/Home/Home'
import TecnologiaPage from './Pages/Tecnologia/TecnologiaPage'
import TecnologiaDetail from './Pages/Tecnologia/TecnologiaDetail'
import DeportesPage from './Pages/Deportes/DeportesPage'
import DeportesDetail from './Pages/Deportes/DeportesDetail'
import PoliticaPage from './Pages/Politica/PoliticaPage'
import PoliticaDetail from './Pages/Politica/PoliticaDetail'
import CulturaPage from './Pages/Cultura/CulturaPage'
import CulturaDetail from './Pages/Cultura/CulturaDetail'
import EconomiaPage from './Pages/Economia/EconomiaPage'
import EconomiaDetail from './Pages/Economia/EconomiaDetail'
import SaludPage from './Pages/Salud/SaludPage'
import SaludDetail from './Pages/Salud/SaludDetail'
import EducacionPage from './Pages/Educacion/EducacionPage'
import EducacionDetail from './Pages/Educacion/EducacionDetail'

function App() {  
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔐 Usuario Firebase:', user)
      
      if (user) { 
        try {
          const userDoc = await getDoc(doc(db, 'usuarios', user.uid))
          
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUsuario({
              uid: user.uid,
              email: user.email,
              nombre: userData.nombre || user.email.split('@')[0],
              rol: userData.rol || 'Reportero'
            })
            console.log('✅ Usuario cargado desde Firestore:', userData)
          } else {
            const nuevoUsuario = {
              email: user.email,
              nombre: user.email.split('@')[0],
              rol: user.email.includes('editor') ? 'Editor' : 'Reportero',
              fecha_creacion: new Date().toISOString()
            }
            
            await setDoc(doc(db, 'usuarios', user.uid), nuevoUsuario)
            setUsuario({
              uid: user.uid,
              ...nuevoUsuario
            })
            console.log('✅ Nuevo usuario creado en Firestore:', nuevoUsuario)
          }
        } catch (error) {
          console.error('❌ Error cargando usuario:', error)
          setUsuario({
            uid: user.uid,
            email: user.email,
            nombre: user.email.split('@')[0],
            rol: user.email.includes('editor') ? 'Editor' : 'Reportero'
          })
        }
      } else {
        setUsuario(null)
      }
      setCargando(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogin = (userData) => {
    console.log('🚀 Login exitoso:', userData)
    setUsuario(userData)
  }

  const handleRegister = (userData) => {
    console.log('🚀 Registro exitoso:', userData)
    setUsuario(userData)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUsuario(null)
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error)
    }
  }

  if (cargando) {
    return (
      <div className="cargando">
        <div className="spinner"></div>
        <p>Cargando aplicación...</p>
      </div>
    )
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Ruta pública - Home con categorías */}
          <Route path="/" element={
            <div className="app-publico">
              <Header usuario={usuario} />
              <main className="main-publico">
                <Home />
              </main>
            </div>
          } />

          {/* Rutas de categorías - Tecnología */}
          <Route path="/tecnologia" element={
            <div className="app-publico">
              <Header usuario={usuario} />
              <main className="main-publico">
                <TecnologiaPage />
              </main>
            </div>
          } />
          <Route path="/tecnologia/:id" element={
            <div className="app-publico">
              <Header usuario={usuario} />
              <main className="main-publico">
                <TecnologiaDetail />
              </main>
            </div>
          } />

          {/* Rutas de categorías - Deportes */}
          <Route path="/deportes" element={
            <div className="app-publico">
              <Header usuario={usuario} />
              <main className="main-publico">
                <DeportesPage />
              </main>
            </div>
          } />
          <Route path="/deportes/:id" element={
            <div className="app-publico">
              <Header usuario={usuario} />
              <main className="main-publico">
                <DeportesDetail />
              </main>
            </div>
          } />

          {/* Rutas de categorías - Política */}
          <Route path="/politica" element={
            <div className="app-publico">
              <Header usuario={usuario} />
              <main className="main-publico">
                <PoliticaPage />
              </main>
            </div>
          } />
          <Route path="/politica/:id" element={
            <div className="app-publico">
              <Header usuario={usuario} />
              <main className="main-publico">
                <PoliticaDetail />
              </main>
            </div>
          } />

          {/* Rutas de categorías - Cultura */}
          <Route path="/cultura" element={
            <div className="app-publico">
              <Header usuario={usuario} />
              <main className="main-publico">
                <CulturaPage />
              </main>
            </div>
          } />
          <Route path="/cultura/:id" element={
            <div className="app-publico">
              <Header usuario={usuario} />
              <main className="main-publico">
                <CulturaDetail />
              </main>
            </div>
          } />

          {/* Rutas de categorías - Economía */}
          <Route path="/economia" element={
            <div className="app-publico">
              <Header usuario={usuario} />
              <main className="main-publico">
                <EconomiaPage />
              </main>
            </div>
          } />
          <Route path="/economia/:id" element={
            <div className="app-publico">
              <Header usuario={usuario} />
              <main className="main-publico">
                <EconomiaDetail />
              </main>
            </div>
          } />

          {/* Rutas de categorías - Salud */}
          <Route path="/salud" element={
            <div className="app-publico">
              <Header usuario={usuario} />
              <main className="main-publico">
                <SaludPage />
              </main>
            </div>
          } />
          <Route path="/salud/:id" element={
            <div className="app-publico">
              <Header usuario={usuario} />
              <main className="main-publico">
                <SaludDetail />
              </main>
            </div>
          } />

          {/* Rutas de categorías - Educación */}
          <Route path="/educacion" element={
            <div className="app-publico">
              <Header usuario={usuario} />
              <main className="main-publico">
                <EducacionPage />
              </main>
            </div>
          } />
          <Route path="/educacion/:id" element={
            <div className="app-publico">
              <Header usuario={usuario} />
              <main className="main-publico">
                <EducacionDetail />
              </main>
            </div>
          } />

          {/* Rutas legacy para compatibilidad */}
          <Route path="/noticias" element={
            <div className="app-publico">
              <Header usuario={usuario} />
              <main className="main-publico">
                <News />
              </main>
            </div>
          } />
          
          <Route path="/noticia/:id" element={
            <div className="app-publico">
              <Header usuario={usuario} />
              <main className="main-publico">
                <NewsDetail />
              </main>
            </div>
          } />

          {/* Ruta de login */}
          <Route path="/login" element={
            usuario ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />
          } />

          {/* Ruta de registro - SIEMPRE ACCESIBLE */}
          <Route path="/register" element={<Register onRegister={handleRegister} />} />

          {/* Ruta administrativa */}
          <Route path="/admin" element={
            usuario ? (
              <div className="app-administrativo">
                <Header usuario={usuario} onLogout={handleLogout} />
                <Dashboard usuario={usuario} />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App