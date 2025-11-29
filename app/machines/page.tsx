'use client'
import { useState } from 'react'
import MachineCard from '@/components/MachineCard'
import { Machine, ControlAction } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import MachineDetailModal from '@/components/MachineDetailModal'

const mockMachines: Machine[] = [
  {
    id: 1,
    name: 'CNC Machine #1',
    status: 'running',
    performance: 85,
    temperature: 42,
    lastMaintenance: '2024-01-15',
    location: 'Production Line A',
    errors: [],
    type: 'CNC',
    uptime: 95.2,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 2,
    name: '3D Printer #2',
    status: 'idle',
    performance: 92,
    temperature: 38,
    lastMaintenance: '2024-01-10',
    location: 'R&D Lab',
    errors: ['Low filament'],
    type: '3D Printer',
    uptime: 88.7,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Assembly Robot #1',
    status: 'maintenance',
    performance: 0,
    temperature: 28,
    lastMaintenance: '2024-01-20',
    location: 'Assembly Line B',
    errors: ['Calibration needed'],
    type: 'Robot Arm',
    uptime: 76.4,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Packaging Machine #3',
    status: 'running',
    performance: 78,
    temperature: 45,
    lastMaintenance: '2024-01-12',
    location: 'Packaging Area',
    errors: [],
    type: 'Packaging',
    uptime: 91.8,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Laser Cutter #1',
    status: 'running',
    performance: 91,
    temperature: 39,
    lastMaintenance: '2024-01-18',
    location: 'Fabrication Area',
    errors: [],
    type: 'Laser Cutter',
    uptime: 93.5,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Injection Molder #2',
    status: 'idle',
    performance: 0,
    temperature: 32,
    lastMaintenance: '2024-01-05',
    location: 'Production Line C',
    errors: ['Heater malfunction'],
    type: 'Injection Molder',
    uptime: 82.1,
    lastUpdate: new Date().toISOString()
  }
]

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>(mockMachines)
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleMachineControl = (machineId: number, action: ControlAction['action']) => {
    setMachines(prev => prev.map(machine => {
      if (machine.id === machineId) {
        switch (action) {
          case 'start':
            return { 
              ...machine, 
              status: 'running', 
              performance: 85,
              lastUpdate: new Date().toISOString()
            }
          case 'stop':
            return { 
              ...machine, 
              status: 'idle', 
              performance: 0,
              lastUpdate: new Date().toISOString()
            }
          case 'restart':
            return { 
              ...machine, 
              status: 'running', 
              performance: 90,
              lastUpdate: new Date().toISOString()
            }
          default:
            return machine
        }
      }
      return machine
    }))
  }

  const handleSaveMachineSettings = (updatedMachine: Machine) => {
    setMachines(prev => prev.map(machine => 
      machine.id === updatedMachine.id ? updatedMachine : machine
    ))
    
    // Update selected machine if it's the one being edited
    if (selectedMachine && selectedMachine.id === updatedMachine.id) {
      setSelectedMachine(updatedMachine)
    }
  }

  const handleMachineClick = (machine: Machine) => {
    setSelectedMachine(machine)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Machines</h1>
          <p className="text-muted-foreground">Manage and monitor all your machines</p>
        </div>
        <Button>Add Machine</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Machine Inventory</CardTitle>
          <CardDescription>Total: {machines.length} machines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machines.map(machine => (
              <div 
                key={machine.id} 
                onClick={() => handleMachineClick(machine)}
              >
                <MachineCard 
                  machine={machine} 
                  onControl={handleMachineControl}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <MachineDetailModal 
        machine={selectedMachine}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onControl={handleMachineControl}
        onSaveSettings={handleSaveMachineSettings}
      />
    </div>
  )
}