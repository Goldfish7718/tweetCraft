"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup } from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import constructPrompt from '@/utils/constructPrompt'
import initializeModel from '@/utils/intializeModel'
import { Check, ChevronDown, Clipboard, Cpu, Loader2, RotateCcw, Twitter } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Home = () => {

  const [style, setStyle] = useState("Casual");
  const [action, setAction] = useState("Generate");
  const [userTweet, setUserTweet] = useState("")
  const [model, setModel] = useState(null);
  const [generatedTweet, setgeneratedTweet] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedTweet);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const generateTweet = async () => {
    setLoading(true)
    const prompt = constructPrompt(userTweet, action, style)

    // @ts-ignore
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    setgeneratedTweet(text)
    setLoading(false)
  }

  useEffect(() => {
    setModel(initializeModel())
  }, [])

  return (
    <TooltipProvider>
      <main>
        <div className='flex from-[#74ebd5] to-[#ACB6E5] bg-gradient-to-r'>
          <h1 className='my-3 text-white text-2xl mx-8'>Tweets-book.</h1>
        </div>

        <section>
          <div className='flex justify-center mt-20'>
            <p className='text-center mx-2 text-xl'>
              Get AI-generated and AI-enhanced tweets for free!🥳
              <br />
              <span className='text-neutral-400 text-sm'>Tweets-book uses Google's Gemini API to generate its responses</span>
            </p>
          </div>

          <div className="flex flex-col px-4 mt-12 mb-4">
            {/* USER INPUT */}
            <section>
              <Textarea placeholder='What&apos;s your tweet about?' onChange={e => setUserTweet(e.target.value)} />

              <div className='my-4'>
                <span className='text-neutral-400 text-sm mb-2'>Select Parameters:</span>
                <br />
                <div className='flex mt-2 w-fit'>
                  <div className='mx-1 w-1/3'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='outline'>{style} <ChevronDown className='ml-4' /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Tweet Style</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={style} onValueChange={setStyle}>
                          <DropdownMenuRadioItem value='Professional'>Professional</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value='Casual'>Casual</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value='Funny'>Funny</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value='Informative'>Informative</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value='Story'>Story</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className='mx-1 w-1/3'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='outline'>{action} <ChevronDown className='ml-4' /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Action</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={action} onValueChange={setAction}>
                          <DropdownMenuRadioItem value='Enhance'>Enhance</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value='Generate'>Generate</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Button className='mx-1 w-1/3' onClick={generateTweet} disabled={loading}>
                    {!loading ? <>Get Tweet <Cpu className="mx-2" /></> : <Loader2 className='animate-spin duration-300 mx-2' />}
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </section>

        {/* GENERATED TWEET */}
        <section className='px-4 mb-10'>
          <Card>
            <CardHeader>
              <Twitter className='mx-2' size={24} />
            </CardHeader>
            <div className='px-4 pb-5'>
              {generatedTweet}
            </div>
            <CardFooter>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Button onClick={handleCopy} className='mx-2' variant='ghost'>{!copied ? <Clipboard size={18} /> : <Check size={18} />}</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Button disabled={loading} className='mx-2' variant='ghost'><RotateCcw size={18} /></Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Regenerate</p>
                </TooltipContent>
              </Tooltip>
            </CardFooter>
          </Card>
        </section>
      </main>
    </TooltipProvider>
  )
}

export default Home