import React from "react";

// ============== BUTTON COMPONENT ==============
export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  fullWidth = false,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-300 rounded-xl";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02]",
    secondary:
      "bg-white text-slate-700 border-2 border-slate-200 hover:border-indigo-500 hover:text-indigo-600",
    ghost: "text-slate-600 hover:text-indigo-600 hover:bg-slate-50",
    danger:
      "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/25",
    success:
      "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/25",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// ============== CARD COMPONENT ==============
export const Card = ({
  children,
  className = "",
  hover = false,
  padding = "md",
  ...props
}) => {
  const paddingSizes = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${
        hover
          ? "hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          : ""
      } ${paddingSizes[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ============== BADGE COMPONENT ==============
export const Badge = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    primary: "bg-blue-100 text-blue-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-rose-100 text-rose-700",
    info: "bg-cyan-100 text-cyan-700",
    purple: "bg-violet-100 text-violet-700",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// ============== INPUT COMPONENT ==============
export const Input = ({ label, error, className = "", ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl outline-none text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white transition-all ${
          error ? "border-rose-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-rose-500 text-xs font-medium">{error}</p>}
    </div>
  );
};

// ============== SELECT COMPONENT ==============
export const Select = ({
  label,
  options = [],
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl outline-none text-slate-800 focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer ${
          error ? "border-rose-500" : ""
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-rose-500 text-xs font-medium">{error}</p>}
    </div>
  );
};

// ============== TEXTAREA COMPONENT ==============
export const Textarea = ({ label, error, className = "", ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl outline-none text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white transition-all resize-none ${
          error ? "border-rose-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-rose-500 text-xs font-medium">{error}</p>}
    </div>
  );
};

// ============== MODAL COMPONENT ==============
export const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-black text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ============== LOADING SPINNER ==============
export const Spinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={`${sizes[size]} border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin ${className}`}
    />
  );
};

// ============== LOADING OVERLAY ==============
export const LoadingOverlay = ({ message = "Loading..." }) => {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
      <Spinner size="lg" />
      <p className="mt-4 text-slate-600 font-medium">{message}</p>
    </div>
  );
};

// ============== EMPTY STATE ==============
export const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-slate-400" />
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  );
};

// ============== PROGRESS BAR ==============
export const ProgressBar = ({
  value = 0,
  max = 100,
  showLabel = false,
  variant = "primary",
  className = "",
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variants = {
    primary: "bg-indigo-600",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-600">Progress</span>
          <span className="text-slate-900">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${variants[variant]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// ============== TABS COMPONENT ==============
export const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
            activeTab === tab.id
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// ============== AVATAR COMPONENT ==============
export const Avatar = ({ src, alt, fallback, size = "md", className = "" }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold ${className}`}
    >
      {fallback || alt?.[0]?.toUpperCase() || "?"}
    </div>
  );
};

// ============== STAT CARD COMPONENT ==============
export const StatCard = ({ icon: Icon, label, value, trend, trendUp }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-indigo-50 rounded-xl">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${
              trendUp
                ? "text-emerald-600 bg-emerald-50"
                : "text-rose-600 bg-rose-50"
            }`}
          >
            {trend}
            <svg
              className={`w-3 h-3 ${trendUp ? "" : "rotate-180"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </span>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          {value}
        </h3>
        <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </p>
      </div>
    </div>
  );
};
