import type { IconName } from '../types/icons';

interface IconProps {
  name: IconName;
  className?: string;
}

const icons: Record<IconName, string> = {
  'chevron-right': '❯',
  'chevron-left': '❮',
  'file': '📄',
  'folder': '📁',
  'clipboard': '📋',
  'keyboard': '⌨️',
  'settings': '⚙️',
  'close': '✕',
  'check': '✓',
  'warning': '⚠️',
  'error': '❌',
};

export const Icon: React.FC<IconProps> = ({ name, className = '' }) => {
  return <span className={className}>{icons[name]}</span>;
};
