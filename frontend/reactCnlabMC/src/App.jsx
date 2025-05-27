import React from 'react'
import { ServerManagePage } from './components/serverManagePage'
import { ExampleDataGrid } from './components/exampleDataGrid'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { LoginPage } from './components/LoginPage'
import { UserManagementPage } from './components/UserManagementPage'
import { AvailableServerPage } from './components/AvailableServerPage'
import { useAuth } from './hooks/AuthContext'

function App() {
  const { role, logout } = useAuth()
  // return (<AvailableServerPage />)
  if(!role) {
    return <LoginPage />
  }

  return (
    <>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar role={role} logout={logout}/>
      <div style={{ flex: 1, padding: '1rem' }}>
        <Routes>
          {role === 'mcadmin' ? (
            <>
              <Route path="/" element={<Navigate to="/server" replace/>} />
              <Route path="/server" element={<ServerManagePage />} />
              <Route path="/user" element={<UserManagementPage />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/available" replace/>} />
              <Route path="/available" element={<AvailableServerPage />} />
            </>
          )}
        </Routes>
      </div>
      </div>
    </>
  )
}

export default App
