import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      type = 'text',
      className = '',
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || props.name || Math.random().toString(36).substring(7);
    const isPassword = type === 'password';
    const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-2xs group">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={computedType}
            value={value}
            onChange={onChange}
            className={`w-full rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-10' : 'pl-3.5'
            } ${
              isPassword || clearable || rightIcon ? 'pr-10' : 'pr-3.5'
            } py-2.5 bg-white dark:bg-slate-900 ${
              error
                ? 'border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200 placeholder-rose-300 focus:border-rose-500 focus:ring-rose-200/50'
                : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-100 dark:focus:ring-indigo-950/60'
            } ${className}`}
            {...props}
          />

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
            {clearable && value && (
              <button
                type="button"
                onClick={onClear}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded cursor-pointer"
                title="Tozalash"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md transition-colors cursor-pointer"
                title={showPassword ? 'Yashirish' : 'Ko‘rsatish'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}

            {!isPassword && rightIcon && (
              <div className="text-slate-400 dark:text-slate-500">{rightIcon}</div>
            )}
          </div>
        </div>

        {error && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
