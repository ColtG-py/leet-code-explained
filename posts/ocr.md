---
title: 'PokéVision: Optical Character Recognition'
date: '2024-08-06'
chapter: '6'
tags: ['OCR', 'Machine Learning', 'Python']
category: 'Intermediate'
---

### The "problem" statement.


If you're anything like me, you are good at finding problems that don't exist. 

You find them for the sole excuse to invent something purpose-built to solve the non-existent problem. Put plainly, you like **solving problems that aren't problems**.

My latest relapse of solving-problems-that-don't-exist came about while playing a variation of a childhood game called "Pokémon Nuzlocke" in which you arbitrarily make the experience of playing Pokémon harder for additional challenge. You can find a synopsis of the rules [here](https://nuzlockeuniversity.ca/nuzlocke-rules/ "Nuzlocke Rules"). 

Before diving in, one additional detail. In order to add additional challenge, I used a ROM [randomizer](https://projectpokemon.org/home/files/file/4413-universal-pokemon-randomizer-gen-1-to-gen-5/ "Randomizer") for Pokémon Emerald in order to randomize the encounter tables (amongst other things). Basically, whenever I ran into a patch of grass, the Pokémon that appeared could be anything.

This can cause issues.

What does that Pokémon know?

Can it end my run?

If you've ever done a Nuzlocke before, you know that certain moves can be run ending. Things like Selfdestruct, Destiny Bond, Pursuit, and Sonic-boom come to mind, but realistically anything can end your run if you aren't aware of it.

This ultimately led to me manually googling the Pokémon, setting the generation, and manually scrubbing through information until I could unearth it's moveset. Great, that took 3 minutes. 3 whole, precious minutes, which could have been spent doing something else.

So like any self-respecting engineer, I spent the next 2 weeks solving the problem. ~20 hours later, I can say that I have kind of saved 3 minutes of manual googling.

In summary, this problem revolved around an admittedly extremely nerdy premise: How much information can I present to myself quickly such that I can make the most optimal choice consistently?

### Analyzing the 'problem'.

Let's dive into how we can fix this. Take a look at this encounter in Pokémon Emerald:

![example-1][example-1]

For those unfamiliar, the opposing Pokémon in this context is CHANSEY. We can see a few key pieces of information, such as the name (CHANSEY), and the level (3). However, we have no visibility into the moveset of this level 3 CHANSEY. This is a problem, because depending on what this CHANSEY knows, I may need to alter my strategy.

First, the manual way. Navigate to https://www.serebii.net, search CHANSEY, and set the generation to III (the generation of Pokémon Emerald).

![example-2][example-2]

Cool, not a problem. This CHANSEY only knows two moves, Pound and Growl, which don't pose a risk. But what if this were a FORTRESS?

![example-3][example-3]

Yikes. FORTRESS knows Selfdestruct from the get-go. This could easily one-shot me. In this case, the knowledge of a given Pokémon's moveset is crucial information to adequately strategize (or accept one's fate).

### How to solve the 'problem'.

If we can read the name of the Pokémon, then surely we can look-up the Pokémon's moveset?

Fortunately, half of this is really easy. If we know the name, we can use https://pokeapi.co/ to very easily look up information about it, including the moves it learns. 

The second half of this takes a bit more digging. How can we figure out what the name of the Pokémon is?

Before continuing, I acknowledge the 'smart' way of doing this would have been to dig into the memory of the emulator to find what address stored this information. But if I did that,  I wouldn't have an excuse to mess with OCR. And I'd rather mess with OCR, personally.

This brings me to Tesseract, an open source OCR (Optical Character Recognition) tool managed by Google, originally created by HP (Hewlett Packard).

As a quick test to see how well the 'basic' Tesseract model performs, I set up the following test case. Looking at this image, I defined two regions of the screen from which I want to attempt to read text:

![example-4][example-4]

Great, let's see how well the default 'eng' model of Tesseract can read this:

```
CHANSE! Be
```

Hmmm... not ideal. I can see why it thinks it says that, as the font used in Pokémon Emerald is readable to a human but very far from, say, Arial.

One more try?

![example-5][example-5]

```
FLY GOH 3
```

Clearly this is an issue. The [font](https://www.fontstruct.com/fontstructions/show/1602780/f77-pokemon-battle "F77 Emerald Font") used is too difficult for Tesseract to interpret by default. Which segues to the fun portion.

### Custom Tesseract models.

I'll keep this short and sweet: the Tesseract documentation sucks. I'm going to defer explaining creating custom Tesseract models in favor of redirecting you to two wonderful videos which perfectly explain exactly how to do this: [first](https://www.youtube.com/watch?v=veJt3U44yqc 
"Building Tesseract 5 from Source with Training Tools") and [second](https://www.youtube.com/watch?v=KE4xEzFGSU8, "Training Tesseract 5 for a New Font"). Massive credit to Gabriel Garcia for publishing an amazing guide for free. Follow along with those and you'll be caught up on how to do this in just a few hours. For now, I'll skip that and share my results:

![example-4][example-4]

```
CHAMSEY 3
```

Much better. Still slightly wrong, but we can work with this.

![example-5][example-5]

```
FLYGON 3
```

Spot on. Training Tesseract-OCR on [this](https://www.fontstruct.com/fontstructions/show/1602780/f77-pokemon-battle "F77 Emerald Font") font gave me notable improvements in character recognition. However, it still occasionally gets a letter or two wrong. How can we circumvent this?

### A bit of duct tape.

I'm sure there's a beautiful way to solve this problem. My gut tells me we should be able to graphically represent all Pokémon, take a name, search a graph database, and find the k-nearest-neighbor. I promise, I'll do that next time. But to make this article feel authentically 2024, we need to incorportate Generative AI in there somewhere... so let's just pass the name and level string to GPT-4o mini and see what it thinks the Pokémon is. I'm sure that could never backfire.

```
CHAMSEY 3

Suggestion from AI: CHANSEY 3
```

Good enough. I'll revisit this later and make it so that I don't have to send a frivolous API call out to make up for my software's shortcomings. All that is left now is to tie all of this together with a nice bow...

![example-6][example-6]

I never claimed it was a pretty bow. I've written a GUI with Tkinter a whopping one other time, and both were equally 'bare'. 

The way this works is pretty simple. You click 'Select Pokémon Name Region', and then drag a bounding box over where the name appears of the enemy Pokémon in battle. Likewise for the 'Select Pokémon Level Region'. Then, once these two are set, you can click 'Start Monitoring', and it will check every second to see if there is something decipherable in those bounding boxes. If there is, it'll display this helpful information panel, complete with most of the information you'd need and the movesets. Otherwise, it quite jankily waits until something appears in that spot. Again, I'm not claiming this is well constructed; just that it kind of works.

When using this tool, it works about 90% of the time, and is genuinely very helpful for saving 3 minutes of googling. 

![example-7][example-7]

![example-10][example-10]

![example-8][example-8]

![example-11][example-11]

It's kind of unbelievable that it works. Until it makes some questionable predictions.

![example-9][example-9]

![example-12][example-12]

That's more in line with what I expected.

### Sources, and a disclaimer.

If you'd like to take a look at the code I wrote, that's available here: https://github.com/ColtG-py/PokeScanner

**DISCLAIMER:** I'm not responsible for how you operate this. I'm not responsible for your OpenAI bill. You made the choice to run this thing with your API key, and I warned you this thing is janky. 

**DISCLAIMER 2:** I do not own any rights to any of the Intellectual Property mentioned in this article. That is owned by The Pokémon Company. I am just sharing a fun story, nothing more.

Thanks for reading, I appreciate it. 

[example-1]: /images/ocr/test.png "ocr-1"
[example-2]: /images/ocr/serebii.png "ocr-2"
[example-3]: /images/ocr/serebii-2.png "ocr-3"
[example-4]: /images/ocr/test-2.png "ocr-4"
[example-5]: /images/ocr/test-3.png "ocr-5"
[example-6]: /images/ocr/app-1.png "ocr-6"
[example-7]: /images/ocr/battle-1.png "ocr-7"
[example-8]: /images/ocr/battle-2.png "ocr-8"
[example-9]: /images/ocr/battle-3.png "ocr-9"
[example-10]: /images/ocr/battleb-1.png "ocr-10"
[example-11]: /images/ocr/battleb-2.png "ocr-11"
[example-12]: /images/ocr/battleb-3.png "ocr-12"