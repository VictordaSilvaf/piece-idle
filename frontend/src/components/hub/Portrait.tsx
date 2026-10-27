import { hubPortraits } from '../../data/portraits';

interface PortraitProps {
  id: string;
  icon: string;
  color?: string;
  className?: string;
}

export function Portrait({ id, icon, color = 'coral', className = '' }: PortraitProps) {
  const source = hubPortraits[id];
  if (source) {
    return <img className={className} src={source} alt="" />;
  }
  return <span className={`portrait-${color} ${className}`.trim()}>{icon}</span>;
}
