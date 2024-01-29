import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { About, Guide, TechNote } from './Pages'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'primeicons/primeicons.css'
import './index.css'

function MainApp() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  )
}

export default function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<MainApp />} />
          <Route path='about' element={<About />} />
          <Route path='guide' element={<Guide />} />
          <Route path='note-1' element={<TechNote param={1} />} />
          <Route path='note-2' element={<TechNote param={2} />} />
          <Route path='*' element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
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
                <Nav.Link href='#about'><i className='pi pi-info-circle mx-1'></i>About</Nav.Link>
                <Nav.Link href='#guide'><i className='pi pi-question-circle mx-1'></i>Guide</Nav.Link>
                <NavDropdown title={<span><i className='pi pi-question-circle mx-1'></i>Technical Note</span>}>
                  <NavDropdown.Item href='#note-1'>Technical Note 1</NavDropdown.Item>
                  <NavDropdown.Item href='#note-2'>Technical Note 2</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </div>

      <div className='container-xl px-2 ' style={{paddingBottom:'50px'}}>
        <Outlet />
      </div>

      <div className='shadow fixed-bottom p-2 justify-content-end'>
        &copy; 2024 <a href='https://sdi.worldpop.org'>WorldPop SDI</a>
      </div>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to='/'>Go to the home page</Link>
      </p>
    </div>
  );
}