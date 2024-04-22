import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { 
  Routes, Route, Outlet, 
  Link, 
  redirect, 
  RouterProvider,
  useNavigate, useLocation, createBrowserRouter
} from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { getFromUrl, GroupSelect, SimpleSelect } from './Utils';
//import { TheChart } from './Chart';
import { Map } from './Map';

import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { mainConfig, indicatorDef } from './config.jsx'

const country_paths = Object.keys(mainConfig)
const countries = country_paths.map((item) => mainConfig[item].Name)

export function MainApp() {
    let navigate = useNavigate()
    let location = useLocation()
    const [appParam, setAppParam] = useState({
      country: '',
      indicator: '',
      config: ''
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
  
    function changeCountry(val){
      let param = {
        country: val,
        indicator: '',
        config: mainConfig[val]
      }
      setAppParam(param, {replace:true})
      navigate('/'+val, {replace:true})

      if (document.getElementById('selectTheme')) {
        document.getElementById('selectTheme').value = 'default'
        document.getElementById('selectIndicator').value = 'default'  
      }
    }
  
    function changeIndicator(val){
      const url = `/${appParam.country}/${val}`
      navigate(url, {replace:true})
    }
  
    function SelectCountry(){
      return (
        <div>
          <b>Select country</b>
          <SimpleSelect 
              name='Country'
              items={countries}
              value={appParam.country}
              pass={changeCountry}
              noDefault={false}
          />
        </div>
      )
    }

    const SelectIndicator = useMemo(() => {
      if (appParam.country) {
        let indicators = []
        Object.keys(appParam.config.indicators).forEach((item) => {
          indicators.push(indicatorDef[item])
        })
        console.log('selectIndicator', appParam.config.indicators)
        return (
          <div>
            <b>Select indicator {appParam.country}</b>
            <GroupSelect
                items={indicators} 
                keys={['Theme', 'Indicator']} 
                fixed={['Theme']}
                lead={['Theme']}
                end={'Indicator'}
                defaultOpt={appParam.indicator}
                pass={changeIndicator}/>
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
          <div className='col-md-5 m-0 p-0'>
            {appParam.indicator ? <Map param={appParam} /> : <></>}
          </div>
        </div>
      </div>
    )
  }