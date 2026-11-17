import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Command } from 'lucide-react';

export interface SearchProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  showShortcut?: boolean;
}

export const Search: React.FC<SearchProps> = ({
  value: controlledValue,
  onChange,
  placeholder = 'Qidiruv (Ctrl + K)...',
  debounceMs = 300,
  className = '',
  showShortcut = true,
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue || '');
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl + K / Cmd + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(internalValue);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [internalValue, debounceMs, onChange]);

  const handleClear = () => {
    setInternalValue('');
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full ${className}`}>
      <SearchIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-14 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 focus:border-indigo-500 transition-all"
      />
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {internalValue ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded cursor-pointer"
            title="Tozalash"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : showShortcut ? (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        ) : null}
      </div>
    </div>
  );
};
