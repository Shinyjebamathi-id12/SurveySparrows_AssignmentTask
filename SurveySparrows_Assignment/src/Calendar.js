
import React, {useState, useMemo} from 'react';
import dayjs from 'dayjs';
import eventsData from './events.json';

function monthMatrix(year, month){
  const first = dayjs(new Date(year, month, 1));
  const start = first.startOf('week');
  const matrix = [];
  let cursor = start;
  for(let r=0;r<6;r++){
    const week = [];
    for(let c=0;c<7;c++){
      week.push(cursor);
      cursor = cursor.add(1,'day');
    }
    matrix.push(week);
  }
  return matrix;
}

function sameDay(a,b){
  return a.isSame(b,'day');
}

export default function Calendar(){
  const today = dayjs();
  const [cursor, setCursor] = useState(dayjs());
  const month = cursor.month();
  const year = cursor.year();

  const matrix = useMemo(()=> monthMatrix(year, month), [year,month]);

  // parse events into map by date
  const eventsByDate = useMemo(()=>{
    const map = {};
    eventsData.forEach(ev=>{
      const key = ev.date;
      if(!map[key]) map[key]=[];
      map[key].push(ev);
    });
    // sort by start time
    Object.keys(map).forEach(k => {
      map[k].sort((a,b)=> a.start.localeCompare(b.start));
      // mark conflicts: if same start time -> conflict
      for(let i=0;i<map[k].length;i++){
        for(let j=i+1;j<map[k].length;j++){
          if(map[k][i].start === map[k][j].start){
            map[k][i].conflict = true;
            map[k][j].conflict = true;
          }
        }
      }
    })
    return map;
  },[]);

  const prevMonth = () => setCursor(c => c.subtract(1,'month'));
  const nextMonth = () => setCursor(c => c.add(1,'month'));
  const goToday = () => setCursor(dayjs());

  return (
    <div className="calendar" role="region" aria-label="Calendar">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:6}}>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button className="btn" onClick={prevMonth} aria-label="Previous month">◀</button>
          <button className="btn" onClick={goToday} aria-label="Today">Today</button>
          <button className="btn" onClick={nextMonth} aria-label="Next month">▶</button>
          <div className="monthLabel" style={{marginLeft:12}}>
            {cursor.format('MMMM YYYY')}
          </div>
        </div>
        <div className="legend" aria-hidden>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',fontSize:12,opacity:0.9}}>
              <div>Events</div>
              <div style={{fontSize:11,opacity:0.8}}>Conflicts marked in red</div>
            </div>
          </div>
        </div>
      </div>

      <div className="weekdays" aria-hidden>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=> <div key={d}>{d}</div>)}
      </div>

      <div className="grid" role="grid">
        {matrix.flat().map((day,idx)=>{
          const iso = day.format('YYYY-MM-DD');
          const inMonth = day.month() === month;
          const isToday = sameDay(day, today);
          const evs = eventsByDate[iso] || [];
          return (
            <div key={iso+idx} className={`cell ${isToday?'today':''} ${!inMonth?'inactive':''}`} role="gridcell" aria-selected={isToday}>
              <div className="date">{day.date()}</div>
              <div className="events">
                {evs.length===0 && <div style={{opacity:0.5,fontSize:12}}>No events</div>}
                {evs.map(ev=>(
                  <div key={ev.id} className={`event ${ev.conflict?'conflict':''}`} title={`${ev.title} • ${ev.start}`}>
                    <strong style={{fontSize:12}}>{ev.title}</strong>
                    <div style={{fontSize:11,opacity:0.85}}>{ev.start} • {Math.max(15,ev.duration_min)}m</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
