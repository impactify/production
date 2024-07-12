import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const colorPalette = [
  'rgba(239, 68, 68, 0.3)', 'rgba(59, 130, 246, 0.3)', 'rgba(34, 197, 94, 0.3)', 'rgba(234, 179, 8, 0.3)', 
  'rgba(168, 85, 247, 0.3)', 'rgba(236, 72, 153, 0.3)', 'rgba(79, 70, 229, 0.3)', 'rgba(20, 184, 166, 0.3)'
];

const AutoRepairGanttChart = () => {
  const [repairs, setRepairs] = useState([
    {
      id: 'repair1',
      name: 'Honda Civic',
      phases: [
        { id: 'phase1', name: 'Inspection', start: new Date(2024, 6, 1), end: new Date(2024, 6, 2) },
        { id: 'phase2', name: 'Parts Order', start: new Date(2024, 6, 2), end: new Date(2024, 6, 4) },
        { id: 'phase3', name: 'Repair', start: new Date(2024, 6, 4), end: new Date(2024, 6, 7) },
        { id: 'phase4', name: 'Paint', start: new Date(2024, 6, 7), end: new Date(2024, 6, 9) },
        { id: 'phase5', name: 'Quality Check', start: new Date(2024, 6, 9), end: new Date(2024, 6, 10) },
      ],
    },
    {
      id: 'repair2',
      name: 'Toyota Camry',
      phases: [
        { id: 'phase6', name: 'Disassembly', start: new Date(2024, 6, 2), end: new Date(2024, 6, 4) },
        { id: 'phase7', name: 'Body Work', start: new Date(2024, 6, 4), end: new Date(2024, 6, 7) },
        { id: 'phase8', name: 'Paint Prep', start: new Date(2024, 6, 7), end: new Date(2024, 6, 9) },
        { id: 'phase9', name: 'Paint', start: new Date(2024, 6, 9), end: new Date(2024, 6, 11) },
        { id: 'phase10', name: 'Reassembly', start: new Date(2024, 6, 11), end: new Date(2024, 6, 14) },
      ],
    },
    {
      id: 'repair3',
      name: 'Ford F-150',
      phases: [
        { id: 'phase11', name: 'Diagnosis', start: new Date(2024, 6, 3), end: new Date(2024, 6, 5) },
        { id: 'phase12', name: 'Parts Replacement', start: new Date(2024, 6, 5), end: new Date(2024, 6, 8) },
        { id: 'phase13', name: 'Electrical Work', start: new Date(2024, 6, 8), end: new Date(2024, 6, 10) },
        { id: 'phase14', name: 'Test Drive', start: new Date(2024, 6, 10), end: new Date(2024, 6, 11) },
      ],
    },
    {
      id: 'repair4',
      name: 'Chevrolet Malibu',
      phases: [
        { id: 'phase15', name: 'Collision Repair', start: new Date(2024, 6, 1), end: new Date(2024, 6, 5) },
        { id: 'phase16', name: 'Frame Alignment', start: new Date(2024, 6, 5), end: new Date(2024, 6, 7) },
        { id: 'phase17', name: 'Paint', start: new Date(2024, 6, 7), end: new Date(2024, 6, 10) },
        { id: 'phase18', name: 'Detailing', start: new Date(2024, 6, 10), end: new Date(2024, 6, 12) },
      ],
    },
  ]);

  const startDate = new Date(2024, 6, 1);
  const endDate = new Date(2024, 6, 15);
  const dateRange = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dateRange.push(new Date(d));
  }

  const dragInfo = useRef({ type: null, repairIndex: null, phaseIndex: null, startX: null, originalStart: null, originalEnd: null });

  const handleMouseDown = (e, repairIndex, phaseIndex, type) => {
    const phase = repairs[repairIndex].phases[phaseIndex];
    dragInfo.current = { 
      type, 
      repairIndex, 
      phaseIndex, 
      startX: e.clientX, 
      originalStart: new Date(phase.start),
      originalEnd: new Date(phase.end)
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!dragInfo.current.type) return;

    const { type, repairIndex, phaseIndex, startX, originalStart, originalEnd } = dragInfo.current;
    const diffDays = Math.round((e.clientX - startX) / 80);
    const updatedRepairs = [...repairs];
    const phase = updatedRepairs[repairIndex].phases[phaseIndex];

    if (type === 'move') {
      const newStart = new Date(originalStart);
      newStart.setDate(newStart.getDate() + diffDays);
      const newEnd = new Date(originalEnd);
      newEnd.setDate(newEnd.getDate() + diffDays);
      phase.start = newStart;
      phase.end = newEnd;
    } else if (type === 'resize-start') {
      const newStart = new Date(originalStart);
      newStart.setDate(newStart.getDate() + diffDays);
      if (newStart < phase.end) phase.start = newStart;
    } else if (type === 'resize-end') {
      const newEnd = new Date(originalEnd);
      newEnd.setDate(newEnd.getDate() + diffDays);
      if (newEnd > phase.start) phase.end = newEnd;
    }

    setRepairs(updatedRepairs);
  };

  const handleMouseUp = () => {
    dragInfo.current = { type: null, repairIndex: null, phaseIndex: null, startX: null, originalStart: null, originalEnd: null };
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const formatDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="flex flex-col items-center">
        <span>{days[date.getDay()]}</span>
        <span>{date.getDate()}</span>
      </div>
    );
  };

  const getDaysDifference = (date1, date2) => {
    return Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="w-full overflow-x-auto">
      <CardContent>
        <div className="flex border-b">
          <div className="w-40 flex-shrink-0 border-r"></div>
          <div className="flex">
            {dateRange.map((date, index) => (
              <div key={date.toISOString()} className="w-20 text-center text-sm border-r">
                {formatDate(date)}
              </div>
            ))}
          </div>
        </div>
        {repairs.map((repair, repairIndex) => (
          <div key={repair.id} className={`flex border-b ${repairIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
            <div className="w-40 flex-shrink-0 font-semibold p-2 border-r">{repair.name}</div>
            <div className="flex relative" style={{ height: '60px' }}>
              {repair.phases.map((phase, phaseIndex) => {
                const left = getDaysDifference(startDate, phase.start) * 80;
                const width = (getDaysDifference(phase.start, phase.end) + 1) * 80 - 4;
                const color = colorPalette[phaseIndex % colorPalette.length];
                const solidColor = color.replace('0.3', '1');
                return (
                  <div
                    key={phase.id}
                    className="absolute rounded-lg overflow-hidden cursor-move"
                    style={{
                      left: `${left}px`,
                      width: `${width}px`,
                      top: phaseIndex % 2 === 0 ? '0px' : '30px',
                      backgroundColor: color,
                      borderLeft: `3px solid ${solidColor}`,
                      borderRight: `3px solid ${solidColor}`,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, repairIndex, phaseIndex, 'move')}
                  >
                    <div className="p-1 text-sm" style={{ color: solidColor }}>
                      {phase.name}
                    </div>
                    <div
                      className="absolute left-0 top-0 w-2 h-full cursor-ew-resize"
                      onMouseDown={(e) => handleMouseDown(e, repairIndex, phaseIndex, 'resize-start')}
                    ></div>
                    <div
                      className="absolute right-0 top-0 w-2 h-full cursor-ew-resize"
                      onMouseDown={(e) => handleMouseDown(e, repairIndex, phaseIndex, 'resize-end')}
                    ></div>
                  </div>
                );
              })}
              {dateRange.map((date, index) => (
                <div
                  key={date.toISOString()}
                  className="absolute border-r h-full"
                  style={{ left: `${index * 80}px`, width: '1px' }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AutoRepairGanttChart;
