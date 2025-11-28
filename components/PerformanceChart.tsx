import { Machine } from '@/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface PerformanceChartProps {
  machines: Machine[];
}

export default function PerformanceChart({ machines }: PerformanceChartProps) {
  const avgPerformance = Math.round(machines.reduce((acc, m) => acc + m.performance, 0) / machines.length)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
        <CardDescription>Real-time machine performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {machines.map(machine => (
            <div key={machine.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{machine.name}</span>
                <span className="text-muted-foreground">{machine.performance}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    machine.performance > 80 ? 'bg-green-500' :
                    machine.performance > 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${machine.performance}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <span className="text-sm text-muted-foreground">Avg Performance</span>
        <span className="font-medium">
          {avgPerformance}%
        </span>
      </CardFooter>
    </Card>
  )
}