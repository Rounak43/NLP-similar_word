/**
 * ErrorAlert – Displays a styled error/warning/info/success message.
 */
import React from 'react';
import { RiErrorWarningLine, RiCheckboxCircleLine, RiInformationLine, RiAlertLine, RiCloseLine } from 'react-icons/ri';

const ICONS = {
  error:   <RiErrorWarningLine size={18} />,
  success: <RiCheckboxCircleLine size={18} />,
  warning: <RiAlertLine size={18} />,
  info:    <RiInformationLine size={18} />,
};

function ErrorAlert({ type = 'error', message, onDismiss }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${type} animate-fadeIn`} role="alert">
      <span style={{ flexShrink: 0, marginTop: 1 }}>{ICONS[type]}</span>
      <span style={{ flex: 1, lineHeight: 1.5 }}>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6, flexShrink: 0, color: 'inherit', padding: 2 }}
          aria-label="Dismiss"
        >
          <RiCloseLine size={16} />
        </button>
      )}
    </div>
  );
}

export default ErrorAlert;
