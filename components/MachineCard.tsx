'use client'
import { useState } from 'react'
import { Play, Square, RotateCcw } from 'lucide-react'
import { Machine, ControlAction } from '@/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface MachineCardProps {
  machine: Machine;
  onControl: (machineId: number, action: ControlAction['action']) => void;
}

export default function MachineCard({ machine, onControl }: MachineCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getStatusVariant = (status: Machine['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'running': return 'default'
      case 'idle': return 'secondary'
      case 'maintenance': return 'destructive'
      case 'error': return 'destructive'
      default: return 'outline'
    }
  }

  const formatLastUpdate = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString()
  }

  return (
    <>
      <Card 
        className="hover:shadow-md transition-shadow cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{machine.name}</CardTitle>
              <CardDescription>{machine.location}</CardDescription>
            </div>
            <Badge variant={getStatusVariant(machine.status)}>
              {machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Performance</span>
              <span className="font-medium">{machine.performance}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Temperature</span>
              <span className="font-medium">{machine.temperature}°C</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Uptime</span>
              <span className="font-medium">{machine.uptime}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Update</span>
              <span className="font-medium">{formatLastUpdate(machine.lastUpdate)}</span>
            </div>
          </div>

          {machine.errors.length > 0 && (
            <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded">
              <p className="text-xs text-destructive">
                ⚠️ {machine.errors[0]}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex space-x-2">
          <Button 
            onClick={(e) => {
              e.stopPropagation()
              onControl(machine.id, 'start')
            }}
            disabled={machine.status === 'running'}
            size="sm"
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-1" />
            Start
          </Button>
          <Button 
            onClick={(e) => {
              e.stopPropagation()
              onControl(machine.id, 'stop')
            }}
            disabled={machine.status !== 'running'}
            variant="destructive"
            size="sm"
            className="flex-1"
          >
            <Square className="w-4 h-4 mr-1" />
            Stop
          </Button>
          <Button 
            onClick={(e) => {
              e.stopPropagation()
              onControl(machine.id, 'restart')
            }}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Restart
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}