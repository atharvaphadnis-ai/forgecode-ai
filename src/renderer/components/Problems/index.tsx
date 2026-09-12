import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import './Problems.css';

interface Problem {
  id: string;
  severity: 'error' | 'warning' | 'info';
  file: string;
  line: number;
  message: string;
}

export const Problems: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([
    {
      id: '1',
      severity: 'error',
      file: 'src/App.tsx',
      line: 42,
      message: "Type 'string' is not assignable to type 'number'",
    },
  ]);

  const handleFixWithAI = (problem: Problem) => {
    console.log('Fix with AI:', problem);
  };

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle size={16} />;
      case 'warning':
        return <Clock size={16} />;
      case 'info':
        return <CheckCircle size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="problems-panel">
      <div className="problems-header">
        <h3>Problems ({problems.length})</h3>
      </div>
      <div className="problems-list">
        {problems.length === 0 ? (
          <div className="empty-state">No problems detected</div>
        ) : (
          problems.map((problem) => (
            <div key={problem.id} className={`problem-item ${problem.severity}`}>
              <div className="problem-icon">{getIcon(problem.severity)}</div>
              <div className="problem-content">
                <div className="problem-message">{problem.message}</div>
                <div className="problem-location">
                  {problem.file}:{problem.line}
                </div>
              </div>
              <button
                onClick={() => handleFixWithAI(problem)}
                className="fix-btn"
              >
                Fix
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
