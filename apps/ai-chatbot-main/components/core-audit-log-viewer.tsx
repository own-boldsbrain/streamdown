'use client'

import { memo, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

type AuditLog = {
  id: string
  timestamp: string
  user: string
  action: string
  details: string
}

type CoreAuditLogViewerProps = {
  logs: AuditLog[]
  className?: string
}

const CoreAuditLogViewer = memo(
  ({ logs, className }: CoreAuditLogViewerProps) => {
    const [filter, setFilter] = useState('')

    const filteredLogs = logs.filter(
      log =>
        log.user.toLowerCase().includes(filter.toLowerCase()) ||
        log.action.toLowerCase().includes(filter.toLowerCase())
    )

    const exportLogs = () => {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        ['id', 'timestamp', 'user', 'action', 'details'].join(',') +
        '\n' +
        filteredLogs
          .map(e => `"${e.id}","${e.timestamp}","${e.user}","${e.action}","${e.details}"`)
          .join('\n')
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'audit-logs.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    return (
      <Card className={cn('h-full w-full flex flex-col', className)}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Audit Log Viewer</CardTitle>
          <div className="flex space-x-2">
            <Input
              placeholder="Filter logs..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={exportLogs} variant="outline">
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing {filteredLogs.length} of {logs.length} logs.
          </div>
        </CardFooter>
      </Card>
    )
  }
)

CoreAuditLogViewer.displayName = 'CoreAuditLogViewer'

export { CoreAuditLogViewer }
