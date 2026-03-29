import { useState } from 'react';
import { Icon } from './Icons';
import { MONTHS, DAYS_SHORT, isSameDay } from '../utils/dateUtils';

export default function Calendar({ selectedDate, onSelect, availability }) {
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date();

  const firstDay    = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

  // Check if a date is available for booking
  const isAvailable = (d) => {
    const dow     = d.getDay();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const avDay   = availability.find(a => Number(a.day_of_week) === dow);
    return avDay && avDay.is_active && d >= todayMidnight;
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), d));
  }

  const prev = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const next = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  return (
    <div>
      <div className="cal-header">
        <button className="cal-nav" onClick={prev}><Icon name="chevLeft" size={16} /></button>
        <span className="cal-month">{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
        <button className="cal-nav" onClick={next}><Icon name="chevRight" size={16} /></button>
      </div>

      <div className="cal-weekdays">
        {DAYS_SHORT.map(d => <div key={d} className="cal-weekday">{d}</div>)}
      </div>

      <div className="cal-days">
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const avail  = isAvailable(d);
          const isToday = isSameDay(d, today);
          const isSel   = selectedDate && isSameDay(d, selectedDate);
          return (
            <div
              key={i}
              className={[
                'cal-day',
                avail  ? 'available' : 'disabled',
                isSel  ? 'selected'  : '',
                isToday && !isSel ? 'today' : '',
              ].join(' ')}
              onClick={() => avail && onSelect(d)}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
