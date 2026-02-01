import React from 'react';
import {
  Heart,
  Brain,
  Zap,
  Quote,
  Star,
  Check,
  ShieldCheck,
  RefreshCcw,
  Sparkles,
  Cpu,
  X,
  AlertCircle,
  Rocket
} from 'lucide-react';

const iconMap: Record<string, React.FC<any>> = {
  Heart,
  Brain,
  Zap,
  Quote,
  Star,
  Check,
  ShieldCheck,
  RefreshCcw,
  Sparkles,
  Cpu,
  X,
  AlertCircle,
  Rocket
};

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

const Icon: React.FC<IconProps> = ({ name, className = "", size = 24 }) => {
  // Normalize name to handle case sensitivity if needed, though usually strict matching is better for performance.
  // Assuming input names match the keys (e.g. "Heart").
  const IconComponent = iconMap[name] || iconMap[name.charAt(0).toUpperCase() + name.slice(1)];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap.`);
    return null;
  }

  return <IconComponent className={className} size={size} />;
};

export default Icon;
