export interface Machine {
    id: number;
    name: string;
    status: 'running' | 'idle' | 'maintenance' | 'error';
    performance: number;
    temperature: number;
    lastMaintenance: string;
    location: string;
    errors: string[];
    type: string;
    uptime: number;
    lastUpdate: string;
  }
  
  export interface NavigationItem {
    name: string;
    href: string;
    icon: React.ReactNode;
  }
  
  export interface ControlAction {
    action: 'start' | 'stop' | 'restart' | 'shutdown';
    machineId: number;
  }