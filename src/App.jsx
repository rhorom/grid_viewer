import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { 
  Routes, Route, Outlet, 
  redirect, 
  RouterProvider,
  useNavigate, useLocation, createBrowserRouter
} from 'react-router-dom'
import { Nav, Navbar, NavDropdown, Form } from 'react-bootstrap'
import { TechNote } from './Pages'
import About from './pages/About.jsx'
import Guide from './pages/Guide.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'primeicons/primeicons.css'
import './index.css'

import { MainApp } from './MainApp.jsx'

export default function App() {
  let router = createBrowserRouter([
    {
      path: '/',
      Component: Layout,
      children: [
        {
          index: true,
          Component: MainApp,
        },
        {
          path: ':country',
          Component: MainApp,
          children: [
            {
              path: ':indicator',
              Component: MainApp
            }
          ]
        },
        {
          path: 'about',
          Component: About
        },
        {
          path: 'guide',
          Component: Guide
        },
        {
          path: 'technote-1',
          Component: TechNote
        },
        {
          path: 'technote-2',
          Component: TechNote
        }
        
      ]
    }
  ])

  return (
    <RouterProvider 
      router={router} 
      fallbackElement={<Fallback/>}
    />
  )
}

function Layout() {
  return (
    <div>
      <div className='shadow mb-4'>
        <div className='container-xl px-2'>
          <Navbar expand='md'>
            <Navbar.Toggle />

            <Navbar.Collapse className='justify-content-end'>
              <Nav>
                <Nav.Link href='/'><i className='pi pi-home mx-1'></i>Home</Nav.Link>
                <Nav.Link href='/about'><i className='pi pi-info-circle mx-1'></i>About</Nav.Link>
                <Nav.Link href='/guide'><i className='pi pi-question-circle mx-1'></i>Guide</Nav.Link>
                <NavDropdown title={<span><i className='pi pi-question-circle mx-1'></i>Technical Note</span>}>
                  <NavDropdown.Item href='/technote-1'>Technical Note 1</NavDropdown.Item>
                  <NavDropdown.Item href='/technote-2'>Technical Note 2</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </div>

      <div className='container-xl px-2' style={{paddingBottom:'50px'}}>
        <Outlet/>
      </div>

      <div className='shadow fixed-bottom p-2 justify-content-end'>
        &copy; 2024 <a href='https://sdi.worldpop.org'>WorldPop SDI</a>
      </div>
    </div>
  )
}

function Fallback() {
  return <p>Performing initial data load</p>;
}