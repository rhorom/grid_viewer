import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { 
  Routes, Route, Outlet, 
  Link, 
  RouterProvider,
  useNavigate, useLocation, createBrowserRouter
} from 'react-router-dom'
import { Nav, Navbar, NavDropdown, Form } from 'react-bootstrap'
import { About, Guide, TechNote } from './Pages'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'primeicons/primeicons.css'
import './index.css'

const countries = ['Burkina Faso', 'India', 'Kenya', 'Nigeria']

export default function App() {
  const [country, setCountry] = useState('')

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
          Component: MainApp
        },
        {
          path: 'about',
          Component: About
        },
        {
          path: 'guide',
          Component: Guide
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
                <Nav.Link href='about'><i className='pi pi-info-circle mx-1'></i>About</Nav.Link>
                <Nav.Link href='guide'><i className='pi pi-question-circle mx-1'></i>Guide</Nav.Link>
                <NavDropdown title={<span><i className='pi pi-question-circle mx-1'></i>Technical Note</span>}>
                  <NavDropdown.Item href='note-1'>Technical Note 1</NavDropdown.Item>
                  <NavDropdown.Item href='note-2'>Technical Note 2</NavDropdown.Item>
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

function MainApp() {
  let navigate = useNavigate()
  const [country, setCountry] = useState('')

  function handleChange(e){
    const val = e.target.value
    setCountry(val)
    console.log(val)
    navigate('/'+val, {replace:true})
  }

  return (
    <div>
      <div className='row'>
        <div className='row'>
          <div className='col'>
            Lorem ipsum dolor sit amet
          </div>
          <div className='col'>
            <Form.Select
              size='sm'
              defaultValue={country}
              onChange={handleChange}
            >
              <option value=''>Select Country</option>
              {countries.map((item, i) => {
                const val = item.replaceAll(' ','').toLowerCase()
                return (
                  <option key={i} value={val}>
                    {item}
                  </option>
                )
              })}
            </Form.Select>
          </div>
        </div>

        <div className='row'>
          <ShowData country={country}/>
        </div>
      </div>
    </div>
  )
}

function ShowData({ country }) {
  return (
    <div>
      <h2>{country}</h2>
    </div>
  )
}