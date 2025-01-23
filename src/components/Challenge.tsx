'use client'
import React from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import ReactCodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import type { Challenge } from '@prisma/client'
import getLevelDescription  from '@/lib/level';

export default  function Challenge(challenge: Challenge){
  const [code, setCode] = useState(`${challenge.boilerplate}`)
  const [showTips, setShowTips] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])

  const runTests = () => {
    const tests = [
      { input: 'hello', expected: 'olleh' },
      { input: 'world', expected: 'dlrow' },
      { input: '', expected: '' },
    ]

    const results = tests.map((test, index) => {
      try {
        const userFunction = new Function(`return ${code}`)()
        const result = userFunction(test.input)
        if (result === test.expected) {
          return `Test ${index + 1}: Passed`
        } else {
          return `Test ${index + 1}: Failed (Expected "${
            test.expected
          }", got "${result}")`
        }
      } catch (error) {
        return `Test ${index + 1}: Error - ${error}`
      }
    })

    setTestResults(results)
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={50}>
        <div className="container mx-auto p-6">
          <div className="flex items-center gap-2 text-3xl font-bold mb-6">
            {challenge.title}
            <Badge>{getLevelDescription(challenge.level)}</Badge>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Description:</h2>
            <div>
            {challenge.description}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2 mt-6">Tips:</h2>
            <Button
              size="sm"
              onClick={() => setShowTips(!showTips)}
              className="mb-2 "
            >
              {showTips ? 'Hide Tips' : 'Show Tips'}
            </Button>
            {showTips && (
              <ul className="list-disc pl-5">
                <li>
                {challenge.tips}
                </li>
              </ul>
            )}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full w-full items-center justify-center p-6">
              <ReactCodeMirror
                value={code}
                onChange={setCode}
                extensions={[javascript()]}
                placeholder="Please enter JS code."
                className="border rounded-lg w-full h-full"
              />
            </div>
          </ResizablePanel>
          <ResizableHandle />

          <ResizablePanel defaultSize={25} className="flex ">
            <div className="h-full w-full flex p-2 tracking-wide flex-col">
              <span className="pl-2">Console</span>
              <span className="h-[1px] w-full mb-2 bg-zinc-300"></span>
              <div className="h-full">
                <i>
                  {testResults.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {testResults.map((result, index) => (
                        <li
                          key={index}
                          className={
                            result.includes('Passed')
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {result}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No tests run yet.</p>
                  )}
                </i>
              </div>
              <Button onClick={runTests} className="bg-black text-white">
                Run
              </Button>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
