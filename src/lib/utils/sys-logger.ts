import { createClient } from "@/lib/supabase/server"

type LogLevel = 'info' | 'warn' | 'error'

export async function logSystemEvent({
  level = 'info',
  module,
  message,
  stack_trace,
  context = {}
}: {
  level?: LogLevel,
  module: string,
  message: string,
  stack_trace?: string,
  context?: any
}) {
  try {
    const supabase = await createClient()
    
    await supabase.from('sys_logs').insert({
      level,
      module,
      message,
      stack_trace,
      context
    })

    console.log(`[SYS_LOG] [${level.toUpperCase()}] [${module}] ${message}`)
  } catch (err) {
    console.error('Failed to write to sys_logs:', err)
  }
}
