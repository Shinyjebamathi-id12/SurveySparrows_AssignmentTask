import React from 'react';
import Calendar from './Calendar';

export default function App(){
  return (
    <div className="app" role="application" aria-label="SurveySparrows Calendar">
      <div className="header">
        <div className="brand">
          <div className="logo">SS</div>
          <div>
            <div style={{fontSize:18,fontWeight:700}}>SurveySparrows</div>
            <div style={{fontSize:12,opacity:0.85}}>Calendar Clone - Month view</div>
          </div>
        </div>
        <div className="controls">
          <a className="btn" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>

      <Calendar />

      <div className="footer">Tip: Click month arrows to navigate. This project folder name: <b>SurveySparrows_Assignment</b></div>
    </div>
  );
}