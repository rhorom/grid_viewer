import { useState, useMemo, useCallback, useRef, useEffect, createContext } from 'react'
import { 
  Routes, Route, Outlet, 
  Link, 
  redirect, 
  RouterProvider,
  useNavigate, useLocation, createBrowserRouter
} from 'react-router-dom'
import { Form, Accordion } from 'react-bootstrap'
import { getFromUrl, GroupSelect, SimpleSelect } from './Utils';
//import { TheChart } from './Chart';
import { Map } from './Map';

import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { mainConfig, indicatorDef } from './config.jsx'
import { fakeAuthProvider } from "./Auth";

const country_paths = Object.keys(mainConfig)
//const countries = country_paths.map((item) => mainConfig[item].Name)
const countries = ['India','Kenya']

let AuthContext = createContext();

function AuthProvider({ children }) {
  let [user, setUser] = useState(null);

  let signin = (newUser, callback) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  let signout = (callback) => {
    return fakeAuthProvider.signout(() => {
      setUser(null);
      callback();
    });
  };

  let value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return useContext(AuthContext);
}

function AuthStatus() {
  let auth = useAuth();
  let navigate = useNavigate();

  if (!auth.user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <p>
      Welcome {auth.user}!{" "}
      <button
        onClick={() => {
          auth.signout(() => navigate("/"));
        }}
      >
        Sign out
      </button>
    </p>
  );
}

function RequireAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || "/";

  function handleSubmit(event) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let username = formData.get("username");

    auth.signin(username, () => {
      navigate(from, { replace: true });
    });
  }

  return (
    <div>
      <p>You must log in to view the page at {from}</p>

      <form onSubmit={handleSubmit}>
        <label>
          Username: <input name="username" type="text" />
        </label>{" "}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export function MainApp() {
    let navigate = useNavigate()
    let location = useLocation()
    const [appParam, setAppParam] = useState({
      country: '',
      indicator: '',
      config: '',
      region: ''
    })
  
    useEffect(() => {
      const val = location.pathname.split('/')
      let param = {
        country: '',
        indicator: '',
        config: ''  
      }
  
      if (country_paths.includes(val[1])){
        param['country'] = val[1]
        param['config'] = mainConfig[val[1]]
        const indicators = Object.keys(param.config.indicators)
  
        if ((val.length === 3) & (indicators.includes(val[2]))){
          param['indicator'] = val[2]
        } else {
          param['indicator'] = ''
        }
      }
  
      setAppParam(param, {replace:true})
    }, [location])
  
    function changeCountry(e){
      const val = e.target.value
      let param = {
        country: val,
        indicator: '',
        config: mainConfig[val],
        region: ''
      }
      setAppParam(param, {replace:true})
      navigate('/'+val, {replace:true})

      if (document.getElementById('selectIndicator')) {
        document.getElementById('selectIndicator').value = ''  
      }
    }
  
    function changeIndicator(e){
      const val = e.target.value
      const url = `/${appParam.country}/${val}`
      navigate(url, {replace:true})
    }
  
    function SelectCountry(){
      return (
        <div>
          <b>Select country</b>
          <Form.Select
            id='selectCountry'
            onChange={changeCountry}
            defaultValue={appParam.country}
          >
            <option value=''></option>
            {countries.map((item,i) => {
              const val = item.replace(' ','').toLowerCase()
              return <option key={i} value={val}>{item}</option>
            })}
          </Form.Select>
        </div>
      )
    }

    const SelectIndicator = useMemo(() => {
      if (appParam.country) {
        let indicators = {}
        Object.keys(appParam.config.indicators).forEach((item) => {
          const theme = appParam.config.indicators[item].Theme
          if (Object.keys(indicators).includes(theme)){
            indicators[theme].push({
              'Key':item, 
              'Indicator':appParam.config.indicators[item].Indicator})
          } else {
            indicators[theme] = [{
              'Key':item, 
              'Indicator':appParam.config.indicators[item].Indicator}]
          }
        })
        return (
          <div>
            <b>Select indicator</b>
            <Form.Select
              id='selectIndicator'
              onChange={changeIndicator}
              defaultValue={appParam.indicator}
            >
              <option value=''></option>
              {Object.keys(indicators).map((item,i) => {
                return (
                  <optgroup label={item} key={i}>
                    {indicators[item].map((subitem,j) => {
                      return (<option key={j} value={subitem.Key}>{subitem.Indicator}</option>)
                    })}
                  </optgroup>
                )
              })}
            </Form.Select>
          </div>
        )  
      } else {
        return <></>
      }
    }, [appParam.country])

    return (
      <div className='container-fluid main-body'>
        <hr/>
        <blockquote className='blockquote text-center p-3'>
          <h2 className='display-5'>Subnational mapping of child and maternal health and development indicators in selected low- and middle-income countries</h2>
        </blockquote>
        <hr/>

        <div className='row mt-3 p-3 mb-3 rounded-3 bg-secondary-subtle'>
          <div className='row d-flex justify-content-between'>
            <div className='col-lg-8'>
              <p>This web application presents a summary of the child and maternal health and development indicators calculated at subnational level (geographic areas below the national level) for a selection of countries of interest to CIFF.</p>
              <p>Multiple indicators are presented in map, chart, and tabulated form, and for multiple time points based on data availability. Changes over time for each indicator are also presented.</p>
              <p>Please consult the <a href='/guide'>Guide</a> and the <a href='/about'>About</a> sections for more information on how to use this portal.</p>
            </div>
            <div className='col-lg-4 p-3' id='selection'>
              <SelectCountry />
              <br/>
              {SelectIndicator}
            </div>
          </div>
        </div>

        <div className='row p-0 m-0'>
          <div className='col-md-7 m-0 p-0'>
            {appParam.indicator ? <Map param={appParam} /> : <></>}
          </div>

          <div className='col-md-5 m-0 p-0 bg-info'>
            {appParam.region ? <>TABLE</> : <>EMPTY</>}
          </div>
          
        </div>
      </div>
    )
  }