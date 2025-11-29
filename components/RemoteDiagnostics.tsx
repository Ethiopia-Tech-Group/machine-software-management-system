'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Wifi,
  HardDrive,
  Cpu,
  Zap
} from 'lucide-react'
import { Machine } from '@/types'

interface DiagnosticResult {
  id: number
  name: string
  status: 'passed' | 'failed' | 'warning'
  message: string
}

interface RemoteDiagnosticsProps {
  machine: Machine
  onFixIssue: (issueId: number) => void
}

export default function RemoteDiagnostics({ machine, onFixIssue }: RemoteDiagnosticsProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [progress, setProgress] = useState(0)

  const runDiagnostics = () => {
    setIsRunning(true)
    setResults([])
    setProgress(0)
    
    // Simulate diagnostic process
    const diagnostics: DiagnosticResult[] = [
      { id: 1, name: 'Connection Test', status: 'passed', message: 'Machine is online and responsive' },
      { id: 2, name: 'Hardware Check', status: machine.errors.length > 0 ? 'warning' : 'passed', message: machine.errors.length > 0 ? 'Minor hardware issues detected' : 'All hardware components functioning properly' },
      { id: 3, name: 'Performance Analysis', status: machine.performance > 80 ? 'passed' : 'warning', message: machine.performance > 80 ? 'Performance within optimal range' : 'Performance below optimal levels' },
      { id: 4, name: 'Temperature Monitoring', status: machine.temperature < 50 ? 'passed' : 'warning', message: machine.temperature < 50 ? 'Temperature within safe range' : 'Temperature approaching critical levels' },
      { id: 5, name: 'System Integrity', status: machine.status !== 'error' ? 'passed' : 'failed', message: machine.status !== 'error' ? 'System integrity verified' : 'System errors detected' },
    ]
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRunning(false)
          setResults(diagnostics)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default: return null
    }
  }

  const getStatusVariant = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'passed': return 'default'
      case 'failed': return 'destructive'
      case 'warning': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="w-5 h-5" />
          Remote Diagnostics
        </CardTitle>
        <CardDescription>Run diagnostics and fix issues without physical access</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning}
            className="flex-1"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Running Diagnostics...' : 'Run Diagnostics'}
          </Button>
          
          {results.length > 0 && (
            <Button variant="outline" onClick={() => setResults([])}>
              Clear Results
            </Button>
          )}
        </div>
        
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Diagnostic Results</h3>
            <div className="space-y-2">
              {results.map((result) => (
                <div 
                  key={result.id} 
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-muted-foreground">{result.message}</div>
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(result.status)}>
                    {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">Recommended Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Restart Machine
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  Clear Cache
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  Optimize Performance
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => onFixIssue(1)}
                >
                  <Wifi className="w-4 h-4" />
                  Reconnect Network
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {!isRunning && results.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Wifi className="w-12 h-12 mx-auto mb-3" />
            <p>Run diagnostics to check machine health</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}