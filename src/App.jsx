import React from 'react'
import Weather from './components/weather'
import './App.css'

const App = () => {
  return (
    <div className="app">
      <div className='title-container'>
        <h1 className='title'>WEATHER PUBLIC</h1>
        <p className='subtitle'>Get the latest weather information for your city.</p> 
      </div>
      <Weather />
      <footer className="footer">
        <p>© {new Date().getFullYear()} Weather Public. All rights reserved.</p>
      </footer>
    </div>
    
  );
};

export default App;
