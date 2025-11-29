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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Thermometer, 
  Activity,
  Clock,
  Wrench
} from 'lucide-react'
import { Machine } from '@/types'

interface MachineSettingsModalProps {
  machine: Machine | null
  open: boolean
  onClose: () => void
  onSave: (updatedMachine: Machine) => void
}

export default function MachineSettingsModal({ 
  machine, 
  open, 
  onClose,
  onSave
}: MachineSettingsModalProps) {
  const [settings, setSettings] = useState<Machine | null>(null)
  
  useEffect(() => {
    if (machine) {
      setSettings({ ...machine })
    }
  }, [machine])

  const handleSave = () => {
    if (settings) {
      onSave(settings)
      onClose()
    }
  }

  const handleChange = (field: keyof Machine, value: any) => {
    if (settings) {
      setSettings({
        ...settings,
        [field]: value
      })
    }
  }

  if (!settings) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            {settings.name} - Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Machine Name</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Machine Type</Label>
                  <Input
                    id="type"
                    value={settings.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={settings.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Maintenance Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lastMaintenance">Last Maintenance Date</Label>
                  <Input
                    id="lastMaintenance"
                    type="date"
                    value={settings.lastMaintenance}
                    onChange={(e) => handleChange('lastMaintenance', e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoMaintenance">Auto Maintenance Alerts</Label>
                  <Switch
                    id="autoMaintenance"
                    checked={settings.status !== 'maintenance'}
                    onCheckedChange={(checked) => handleChange('status', checked ? 'idle' : 'maintenance')}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Performance Thresholds</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4" />
                      Max Temperature (°C)
                    </Label>
                    <span className="text-sm font-medium">{settings.temperature}</span>
                  </div>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.temperature}
                    onChange={(e) => handleChange('temperature', parseInt(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0°C</span>
                    <span>100°C</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Performance Target (%)
                    </Label>
                    <span className="text-sm font-medium">{settings.performance}</span>
                  </div>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.performance}
                    onChange={(e) => handleChange('performance', parseInt(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Target Uptime (%)
                    </Label>
                    <span className="text-sm font-medium">{settings.uptime}</span>
                  </div>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.uptime}
                    onChange={(e) => handleChange('uptime', parseInt(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Remote Management</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="remoteAccess">Remote Access</Label>
                  <Switch id="remoteAccess" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Notifications</Label>
                  <Switch id="notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoRestart">Auto Restart on Error</Label>
                  <Switch id="autoRestart" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}