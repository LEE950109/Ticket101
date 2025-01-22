import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PreferencesProvider } from './context/PreferencesContext'

import Home from './pages/Home'
import Detail from './pages/Detail'
import Login from './pages/Login'
import Mypage from './pages/Mypage'
import Search from './pages/Search'
import Signin from './pages/Signin'
import Not from './pages/Not'

import PreferencesBasic from './pages/PreferencesBasic'
import PreferencesArtists from './pages/PreferencesArtists'
import PreferencesMovies from './pages/PreferencesMovies'
import PreferencesEnd from './pages/PreferencesEnd'

import Header from './components/section/Header'
import Footer from './components/section/Footer'

const App = () => {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <Router>
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/mypage' element={<Mypage />} />
            <Route path='/search' element={<Search />} />
            <Route path='/signin' element={<Signin />} />
            <Route path="/preferences/basic" element={<PreferencesBasic />} />
            <Route path="/preferences/artists" element={<PreferencesArtists />} />
            <Route path="/preferences/movies" element={<PreferencesMovies />} />
            <Route path="/preferences/end" element={<PreferencesEnd />} />
            <Route path='/detail/:id' element={<Detail />} />
            <Route path='/*' element={<Not />} />
          </Routes>
          <Footer />
        </Router>
      </PreferencesProvider>
    </AuthProvider>
  )
}

export default App