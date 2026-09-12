import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import './Terminal.css';

export const Terminal: React.FC = () => {
  const [output, setOutput] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [terminalId, setTerminalId] = useState<string | null>(null);

  useEffect(() => {
    initializeTerminal();
  }, []);

  const initializeTerminal = async () => {
    try {
      const result = await window.electronAPI.createTerminal('default');
      setTerminalId(result.id);
    } catch (error) {
      console.error('Failed to create terminal:', error);
    }
  };

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !terminalId) return;

    try {
      setOutput((prev) => `${prev}$ ${input}\n`);
      const result = await window.electronAPI.executeCommand(terminalId, input);
      setOutput((prev) => `${prev}${result.stdout}\n`);
      if (result.stderr) {
        setOutput((prev) => `${prev}ERROR: ${result.stderr}\n`);
      }
      setInput('');
    } catch (error) {
      console.error('Failed to execute command:', error);
      setOutput((prev) => `${prev}ERROR: ${error}\n`);
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <h3>Terminal</h3>
        <button className="terminal-close">
          <X size={16} />
        </button>
      </div>
      <div className="terminal-output">{output}</div>
      <form onSubmit={handleExecute} className="terminal-input-form">
        <span className="terminal-prompt">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command..."
          className="terminal-input"
          autoFocus
        />
      </form>
    </div>
  );
};
