import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from "react";

export type TitanInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export const TitanInput = forwardRef<HTMLInputElement, TitanInputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-4 text-zinc-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-xl border border-zinc-800 bg-[#141415] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-300 focus:border-yellow-400/60 focus:bg-zinc-900 focus:shadow-[0_0_20px_rgba(250,204,21,0.08)] disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              error && "border-red-500/50 focus:border-red-500",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 text-zinc-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-400">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-zinc-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
TitanInput.displayName = "TitanInput";

export type TitanSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export const TitanSelect = forwardRef<HTMLSelectElement, TitanSelectProps>(
  ({ label, error, className, children, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-zinc-800 bg-[#141415] px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-yellow-400/60 focus:bg-zinc-900 focus:shadow-[0_0_20px_rgba(250,204,21,0.08)] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500/50 focus:border-red-500",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
TitanSelect.displayName = "TitanSelect";

export type TitanTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const TitanTextarea = forwardRef<HTMLTextAreaElement, TitanTextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-zinc-800 bg-[#141415] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-300 focus:border-yellow-400/60 focus:bg-zinc-900 focus:shadow-[0_0_20px_rgba(250,204,21,0.08)] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500/50 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
TitanTextarea.displayName = "TitanTextarea";
