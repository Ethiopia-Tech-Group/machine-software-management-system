'use client'

import { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Square, 
  RotateCcw, 
  Thermometer, 
  Clock, 
  Calendar,
  Activity,
  Wrench,
  Settings,
  Wifi
} from 'lucide-react'
import { Machine, ControlAction } from '@/types'
import MachineSettingsModal from '@/components/MachineSettingsModal'
import RemoteDiagnostics from '@/components/RemoteDiagnostics'

interface MachineDetailModalProps {
  machine: Machine | null
  open: boolean
  onClose: () => void
  onControl: (machineId: number, action: ControlAction['action']) => void
  onSaveSettings: (updatedMachine: Machine) => void
}

// Speed gauge component
function SpeedGauge({ value, maxValue = 100, label }: { value: number; maxValue?: number; label: string }) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100))
  const rotation = (percentage / 100) * 180 - 90 // -90 to 90 degrees
  
  // Determine color based on percentage
  let color = '#10B981' // green
  if (percentage < 30) {
    color = '#EF4444' // red
  } else if (percentage < 70) {
    color = '#F59E0B' // yellow
  }
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Gauge background */}
        <div className="absolute inset-0 rounded-t-full border-8 border-gray-200 border-b-0"></div>
        
        {/* Gauge fill */}
        <div 
          className="absolute bottom-0 left-1/2 w-48 h-24 origin-bottom"
          style={{ 
            transform: `translateX(-50%) rotate(${rotation}deg)`,
            transformOrigin: 'bottom center',
            transition: 'transform 0.5s ease-out'
          }}
        >
          <div 
            className="w-full h-full bg-current rounded-t-full"
            style={{ backgroundColor: color }}
          ></div>
        </div>
        
        {/* Center indicator */}
        <div className="absolute bottom-0 left-1/2 w-1 h-8 bg-gray-800 origin-bottom transform -translate-x-1/2"
          style={{ 
            transform: `translateX(-50%) rotate(${rotation}deg)`,
            transformOrigin: 'bottom center'
          }}
        ></div>
        
        {/* Center circle */}
        <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-gray-800 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* Value display */}
      <div className="mt-4 text-center">
        <div className="text-3xl font-bold">{value}<span className="text-lg">%</span></div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}

export default function MachineDetailModal({ 
  machine, 
  open, 
  onClose,
  onControl,
  onSaveSettings
}: MachineDetailModalProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'diagnostics'>('overview')
  const getStatusVariant = (status: Machine['status']) => {
    switch (status) {
      case 'running': return 'default'
      case 'idle': return 'secondary'
      case 'maintenance': return 'destructive'
      case 'error': return 'destructive'
      default: return 'outline'
    }
  }

  const handleFixIssue = (issueId: number) => {
    // Simulate fixing an issue
    console.log(`Fixing issue ${issueId}`)
  }

  if (!machine) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="min-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-2xl">{machine.name}</span>
              <Badge variant={getStatusVariant(machine.status)} className="text-lg py-2 px-4">
                {machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          {/* Tab Navigation */}
          <div className="flex border-b">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              className="rounded-none rounded-tl rounded-tr"
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </Button>
            <Button
              variant={activeTab === 'diagnostics' ? 'default' : 'ghost'}
              className="rounded-none rounded-tl rounded-tr"
              onClick={() => setActiveTab('diagnostics')}
            >
              <Wifi className="w-4 h-4 mr-2" />
              Remote Diagnostics
            </Button>
          </div>
          
          {activeTab === 'overview' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
              {/* Left column - Machine Info */}
              <div className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Machine Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-32 font-medium">Type:</span>
                      <span>{machine.type}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-32 font-medium">Location:</span>
                      <span>{machine.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-32 font-medium">Last Maintenance:</span>
                      <span>{machine.lastMaintenance}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-32 font-medium">Last Update:</span>
                      <span>{new Date(machine.lastUpdate).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Status Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Thermometer className="w-5 h-5 mr-3 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Temperature</span>
                          <span className="font-medium">{machine.temperature}°C</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="h-2 rounded-full bg-blue-500" 
                            style={{ width: `${Math.min(100, machine.temperature)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Activity className="w-5 h-5 mr-3 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Performance</span>
                          <span className="font-medium">{machine.performance}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${
                              machine.performance > 80 ? 'bg-green-500' :
                              machine.performance > 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${machine.performance}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-3 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Uptime</span>
                          <span className="font-medium">{machine.uptime}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${
                              machine.uptime > 90 ? 'bg-green-500' :
                              machine.uptime > 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${machine.uptime}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {machine.errors.length > 0 && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2 text-destructive">Errors</h3>
                    <div className="space-y-2">
                      {machine.errors.map((error, index) => (
                        <p key={index} className="text-destructive flex items-start">
                          <span className="mr-2">⚠️</span>
                          <span>{error}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right column - Gauges */}
              <div className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-6 text-center">Performance Dashboard</h3>
                  
                  <div className="flex flex-col items-center mb-8">
                    <SpeedGauge value={machine.performance} label="Performance" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold">{machine.temperature}°C</div>
                      <div className="text-sm text-muted-foreground">Temperature</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold">{machine.uptime}%</div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={() => onControl(machine.id, 'start')}
                      disabled={machine.status === 'running'}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                    <Button 
                      onClick={() => onControl(machine.id, 'stop')}
                      disabled={machine.status !== 'running'}
                      variant="destructive"
                      className="flex-1"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                    <Button 
                      onClick={() => onControl(machine.id, 'restart')}
                      variant="outline"
                      className="flex-1"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restart
                    </Button>
                  </div>
                  
                  <Button 
                    variant="secondary" 
                    className="w-full mt-3"
                    onClick={() => setIsSettingsOpen(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Adjust Settings
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <RemoteDiagnostics machine={machine} onFixIssue={handleFixIssue} />
            </div>
          )}
          
          <DialogFooter className="sm:justify-between gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <MachineSettingsModal
        machine={machine}
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(updatedMachine) => {
          onSaveSettings(updatedMachine)
          setIsSettingsOpen(false)
        }}
      />
    </>
  )
}