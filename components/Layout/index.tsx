import React from 'react'
import Sidebar from '../Sidebar'
import Topbar from '../Topbar'

const Layout = ({ children }: any) => {
  return (
    <div>
      <div className="h-screen flex flex-row justify-start">
        <Sidebar />
        <div className="bg-primary flex-1 text-black">
          <Topbar />
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
