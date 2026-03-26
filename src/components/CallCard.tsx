import React from 'react';
import { Calendar, ArrowRight, FileText } from 'lucide-react';

export interface Call {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'open' | 'closing' | 'closed';
}

export const CallCard: React.FC<{ call: Call }> = ({ call }) => {
  const statusColors = {
    open: 'bg-obs-teal/10 text-obs-teal border-obs-teal/20',
    closing: 'bg-obs-gold/10 text-obs-gold border-obs-gold/20',
    closed: 'bg-gray-100 text-gray-500 border-gray-200',
  };

  const statusText = {
    open: 'Aberta',
    closing: 'Encerrando',
    closed: 'Encerrada',
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-obs-bg shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[call.status]}`}>
          {statusText[call.status]}
        </div>
        <div className="flex items-center gap-2 text-obs-dark/50 text-sm font-medium">
          <Calendar size={16} />
          <span>Até {call.deadline}</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-obs-dark mb-3 group-hover:text-obs-light transition-colors">
        {call.title}
      </h3>
      
      <p className="text-obs-dark/70 text-sm leading-relaxed mb-8">
        {call.description}
      </p>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-sm font-semibold text-obs-dark hover:text-obs-light transition-colors">
          <FileText size={18} />
          Ver edital
        </button>
        <button 
          className="flex items-center gap-2 text-sm font-semibold text-white bg-obs-light hover:bg-obs-dark px-5 py-2.5 rounded-lg transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={call.status === 'closed'}
        >
          Submeter
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
