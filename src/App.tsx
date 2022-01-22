import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

import { HomePage } from './pages/HomePage/HomePage'
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage'
import { RoomPage } from './pages/RoomPage/RoomPage'

export const App = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/room/:id" element={<RoomPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </HashRouter>
)
