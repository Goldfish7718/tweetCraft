"use client"

import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import constructPrompt from '@/utils/constructPrompt'
import initializeModel from '@/utils/intializeModel'
import { Check, ChevronDown, Clipboard, Cpu, Loader2, RotateCcw, Twitter } from 'lucide-react'
import Link from 'next/link'
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

  const handleTweetIntent = async () => {
    let hashtags: string[] = generatedTweet.match(/#[\w]+/g) || [];
    
    // Remove hashtags from the tweet
    let tweetWithoutHashtags = generatedTweet.replace(/#[\w]+/g, '').trim();
    
    // Remove the '#' symbol from each hashtag
    hashtags = hashtags.map(tag => tag.substring(1));

    console.log(hashtags);

    // Join hashtags with commas for the URL
    const formattedHashtags = hashtags.join(',');

    // Open the Twitter intent URL
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetWithoutHashtags)}&hashtags=${encodeURIComponent(formattedHashtags)}`, '_blank');
}

  useEffect(() => {
    setModel(initializeModel())
  }, [])

  return (
    <TooltipProvider>
      <main className='h-auto'>
        <div className='flex from-[#74ebd5] to-[#ACB6E5] bg-gradient-to-r justify-center md:justify-start'>
          <h1 className='my-3 text-white text-2xl mx-8'>TweetCraft.</h1>
        </div>

        <div className='flex justify-center mt-20'>
          <p className='text-center mx-2 text-xl'>
            Get AI-generated and AI-enhanced tweets for free!🥳
            <br />
            {/* <div className='mt-6 md:mt-0'> */}
              <span className='text-neutral-400 text-sm'>TweetCraft uses Google&apos;s Gemini API to generate its responses</span>
            {/* </div> */}
          </p>
        </div>

        {/* flex flex-col md:flex-row px-4 mt-12 mb-4 w-full */}
        <section className='flex w-full md:flex-row flex-col mt-10 flex-grow'>
          {/* USER INPUT */}
          <div className='mx-3 md:w-1/2'>
            <Textarea placeholder='What&apos;s your tweet about?' onChange={e => setUserTweet(e.target.value)} rows={10} />

            <div className='my-4'>
              <span className='text-neutral-400 text-sm mb-2'>Select Parameters:</span>
              <br />
              <div className='flex flex-col md:flex-row mt-2'>
                <div className='mx-1 w-full md:w-1/3 my-1 md:my-0'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline' className='w-full'>{style} <ChevronDown className='ml-4' /></Button>
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
                <div className='mx-1 w-full md:w-1/3 my-1 md:my-0'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline' className='w-full'>{action} <ChevronDown className='ml-4' /></Button>
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
                <Button className='mx-1 w-full md:w-1/3 my-1 md:my-0' onClick={generateTweet} disabled={loading}>
                  {!loading ? <>Get Tweet <Cpu className="mx-2" /></> : <Loader2 className='animate-spin duration-300 mx-2' />}
                </Button>
              </div>
            </div>
          </div>

          {/* GENERATED TWEET */}
          {generatedTweet &&
              <Card className='mx-3 md:w-1/2 flex flex-col'>
                <CardHeader>
                  <Twitter className='mx-2' size={24} />
                </CardHeader>
                <div className='px-4 pb-5 flex-grow'>
                  {generatedTweet}
                </div>
                <Separator />
                <CardFooter className='p-3'>
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
                      <Button disabled={loading} onClick={generateTweet} className='mx-2' variant='ghost'><RotateCcw size={18} /></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Regenerate</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger>
                      <Button disabled={loading} onClick={handleTweetIntent} className='mx-2' variant='ghost'><Twitter size={18} /></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tweet</p>
                    </TooltipContent>
                  </Tooltip>
                </CardFooter>
              </Card>
          }
          {!generatedTweet &&
            <div className='outline rounded-md justify-center items-center outline-1 outline-neutral-200 w-1/2 mx-3 hidden md:flex'>
              <p>Your tweet will appear here</p>
            </div>
          }
        </section>

        

        <footer className='justify-center mt-8'>
          <div className='py-3 flex flex-col justify-center'>
            <p className='text-sm text-neutral-500 text-center mx-2'>
              TweetCraft may not produce the desired response always, in such cases, try to regenerate response with different prompts.
            </p>
            <p className='text-sm text-neutral-500 text-center'>Made with &lt;3 by <Link href="https://bento.me/tejasnanoti" className='hover:underline'>Tejas</Link></p>
          </div>
        </footer>
      </main>
    </TooltipProvider>
  )
}

// https://twitter.com/intent/tweet?text=crazy%20shit%20%23gotsuspended
export default Home