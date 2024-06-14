import { UseChatHelpers } from 'ai/react'
import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  IconPlayground,
  IconSparkles,
  IconSpinner
} from '@/components/ui/icons'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'

export interface PromptProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput('')
        await onSubmit(input)
      }}
      ref={formRef}
    >
      <div className="bg-background relative flex max-h-60 w-full grow flex-col overflow-hidden p-2 sm:rounded-2xl sm:border">
        <div className="flex w-full flex-col">
          <label
            htmlFor="playground"
            className="text-config text-foreground flex justify-between gap-y-4 rounded-xl px-3 py-4 font-medium leading-6 md:flex-row md:items-center md:gap-y-0"
          >
            <div className="flex items-center gap-x-2">
              <IconPlayground
                className="text-muted-foreground/50 h-5 w-5"
                aria-hidden="true"
              />
              <h3>Chat</h3>
            </div>

            <div className="flex items-center justify-center gap-2 md:justify-start">
              {/* Reset chat */}
              <Button
                variant="ghost"
                className="max-w-xs"
                onClick={e => {
                  e.preventDefault()
                  router.refresh()
                  router.push('/')
                }}
              >
                Reset
              </Button>
              {/* Send button */}
              <Button type="submit" disabled={isLoading || input === ''}>
                {isLoading ? (
                  <IconSpinner className="mr-2" />
                ) : (
                  <IconSparkles className="mr-2" />
                )}
                Send
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </label>
        </div>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          maxRows={10}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter your prompt message..."
          spellCheck={false}
          className="bg-muted min-h-[60px] w-full resize-none rounded-lg px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
      </div>
    </form>
  )
}
