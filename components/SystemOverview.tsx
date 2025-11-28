import { Cpu, Play, AlertTriangle, Wrench } from 'lucide-react'
import { Machine } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SystemOverviewProps {
  machines: Machine[];
}

export default function SystemOverview({ machines }: SystemOverviewProps) {
  const stats = {
    total: machines.length,
    running: machines.filter(m => m.status === 'running').length,
    idle: machines.filter(m => m.status === 'idle').length,
    maintenance: machines.filter(m => m.status === 'maintenance' || m.status === 'error').length,
  }

  const overviewCards = [
    {
      title: 'Total Machines',
      value: stats.total,
      icon: <Cpu className="w-6 h-6 text-blue-600" />,
      description: 'All machines in system',
    },
    {
      title: 'Running',
      value: stats.running,
      icon: <Play className="w-6 h-6 text-green-600" />,
      description: 'Currently operational',
    },
    {
      title: 'Idle',
      value: stats.idle,
      icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
      description: 'Awaiting operations',
    },
    {
      title: 'Maintenance',
      value: stats.maintenance,
      icon: <Wrench className="w-6 h-6 text-red-600" />,
      description: 'Require attention',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {overviewCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </div>
            <div className="p-2 rounded-lg bg-muted">
              {card.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}