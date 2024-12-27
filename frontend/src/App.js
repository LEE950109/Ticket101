import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Detail from './pages/Detail'
import Login from './pages/Login'
import Mypage from './pages/Mypage'
import Search from './pages/Search'
import Signin from './pages/Signin'
import Not from './pages/Not'

import Header from './components/section/Header'
import Footer from './components/section/Footer'

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/mypage' element={<Mypage />} />
        <Route path='/search' element={<Search />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/detail/:id' element={<Detail />} />
        <Route path='/*' element={<Not />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App