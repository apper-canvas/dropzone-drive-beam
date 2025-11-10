import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Outlet />
    </div>
  )
}

export default Layout