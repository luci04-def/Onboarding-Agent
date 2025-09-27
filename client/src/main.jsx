
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/index.css'

import Home from './pages/Home'
import Invite from './pages/Invite'
import Login from './pages/Login'
import VendorLogin from './pages/VendorLogin'
import DistributorLogin from './pages/DistributorLogin'
import Distributor from './pages/Distributor'
import Vendor from './pages/Vendor'
import Category from './pages/Category'
import DistributorDetail from './pages/DistributorDetail'
import { PrivateRoute } from './components/PrivateRoute'
import DistributorTraining from './pages/DistributorTraining'

const router = createBrowserRouter([
  { path:'/', element:<Home/> },
  { path:'/invite', element:<Invite/> },
  { path:'/login', element:<Login/> },
  { path:'/vendor-login', element:<VendorLogin/> },
  { path:'/distributor-login', element:<DistributorLogin/> },
  { path:'/distributor', element:<PrivateRoute role="distributor"><Distributor/></PrivateRoute> },
  { path:'/distributor/training', element:<PrivateRoute role="distributor"><DistributorTraining/></PrivateRoute> },
  { path:'/vendor', element:<PrivateRoute role="vendor"><Vendor/></PrivateRoute> },
  { path:'/category/:role', element:<PrivateRoute role="vendor"><Category/></PrivateRoute> },
  { path:'/vendor/distributor/:id', element:<PrivateRoute role="vendor"><DistributorDetail/></PrivateRoute> },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

