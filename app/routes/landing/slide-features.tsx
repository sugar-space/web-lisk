import { Icon } from "@sugar/icon"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"
import { cn } from "~/utils/cn"

export function SlideFeatures() {
  const quotesWrapRef = useRef<HTMLDivElement>(null)
  const currentIndexRef = useRef<number>(0)

  const quotes = [
    "The greatest gift",
    "Be a loyal supporter",
    "Support builds a vibrant community",
    "Give with purpose, not pressure",
    "Celebrate creators with crypto",
    "Small tokens, big impact",
    "Empower the ones who inspire you",
    "Kindness travels onchain",
  ]

  function animateQuotes() {
    gsap.delayedCall(1.5, () => {
      const quotesWrap = document.querySelector("#quotesWrap")

      if (quotesWrap) {
        const rect = quotesWrap.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0

        if (isVisible) {
          const quoteElements = document.querySelectorAll("#quotesWrap > div > h2")
          let i = currentIndexRef.current

          gsap.killTweensOf(quoteElements[i])
          gsap.to(quoteElements[i], {
            opacity: 0,
            x: "-20px",
            ease: "power4.in",
          })

          i++
          if (i >= quoteElements.length) {
            i = 0
          }
          currentIndexRef.current = i

          gsap.set(quoteElements[i], {
            x: "20px",
          })

          gsap.delayedCall(0.6, () => {
            gsap.to(quoteElements[i], {
              opacity: 1,
              x: "0px",
              ease: "power4.out",
            })
          })
        }
      }

      animateQuotes()
    })
  }

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const quoteElements = document.querySelectorAll("#quotesWrap > div > h2")

    quoteElements.forEach((element, index) => {
      if (index !== 0) {
        gsap.set(element, { opacity: 0, x: "20px" })
      } else {
        gsap.set(element, { opacity: 1, x: "0px" })
      }
    })

    currentIndexRef.current = 0

    animateQuotes()
  }, [])

  return (
    <div
      id="quotesWrap"
      ref={quotesWrapRef}
      className={cn(
        "flex flex-col-reverse md:flex-row items-center justify-between gap-y-8 px-4 sm:px-[20px] lg:px-[50px] py-[40px]"
      )}
    >
      <div className="relative pointer-events-auto w-full grow text-center md:text-left flex items-center justify-center md:justify-start min-h-[100px]">
        {quotes.map((quote, index) => (
          <h2
            key={index}
            className={cn(
              "text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight",
              index === 0 ? "relative" : "absolute top-0 opacity-0"
            )}
          >
            {quote}
          </h2>
        ))}
      </div>

      <AnimateCandy />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Animating Candy                              */
/* -------------------------------------------------------------------------- */
function AnimateCandy() {
  const candyWrapRef = useRef<HTMLDivElement>(null)
  const currentIndexRef = useRef<number>(0)

  function animateCandy() {
    gsap.delayedCall(1.5, () => {
      const candyWrap = document.querySelector("#candyWrap")

      if (candyWrap) {
        const rect = candyWrap.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0

        if (isVisible) {
          const quoteElements = document.querySelectorAll("#candyWrap > svg")
          let i = currentIndexRef.current

          gsap.killTweensOf(quoteElements[i])
          gsap.to(quoteElements[i], {
            opacity: 0,
            ease: "power4.out",
          })

          i++
          if (i >= quoteElements.length) {
            i = 0
          }
          currentIndexRef.current = i

          gsap.delayedCall(0.6, () => {
            gsap.to(quoteElements[i], {
              opacity: 1,
              ease: "power4.in",
            })
          })
        }
      }

      animateCandy()
    })
  }

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const candys = document.querySelectorAll("#candyWrap > svg")

    candys.forEach((element, index) => {
      if (index !== 0) {
        gsap.set(element, { opacity: 0 })
      } else {
        gsap.set(element, { opacity: 1 })
      }
    })

    currentIndexRef.current = 0

    animateCandy()
  }, [])

  return (
    <div
      id="candyWrap"
      ref={candyWrapRef}
      className="relative flex h-[100px] aspect-square bg-red-500 rounded-full items-center justify-center"
    >
      <Icon name="candy" className="size-[60px] absolute m-auto w-full opacity-0" />
      <Icon name="lollipop" className="size-[60px] absolute m-auto w-full opacity-0" />
      <Icon name="cupcake" className="size-[60px] absolute m-auto w-full opacity-0" />
    </div>
  )
}
