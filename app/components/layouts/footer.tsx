import { Icon } from "@sugar/icon"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"
import { Logo } from "~/routes/landing/logo"

export function Footer() {
  return (
    <footer
      id="record"
      className="relative overflow-hidden px-[20px] md:px-[50px] pt-[20px] pb-[80px] md:pb-[25px] md:pt-[75px] lg:h-screen flex flex-col"
    >
      <div className="z-[2] text-center backdrop-blur-[100px] bg-[#373737]/[0.4] rounded-[10px] flex-grow flex flex-col">
        <div className="relative flex-grow flex flex-col">
          <div className="flex flex-col items-center justify-center flex-grow px-[20px] pt-[45px] lg:pt-[65px]">
            <span className="font-cherry">Sugar</span>
            <p className="mx-auto mt-[10px] lg:mt-[30px]">
              <span className="block text-[#E8E7DC]/30">
                A meaningful way to connect with the creators who inspire you.
              </span>
              Explore the possibilities—
              <br />
              start gifting crypto and show your support.
            </p>

            <div className="flex-grow grid place-items-center relative w-full mt-[30px] mb-[30px] lg:my-0">
              <div className="relative w-full">
                <p
                  className="hidden order-3 pb-[25px] lg:block lg:pb-0 text-center lg:text-left lg:absolute lg:left-0 max-w-[194px] mx-auto lg:mx-0 bodySmall opacity-20 leading-[1.4]"
                  aria-hidden="true"
                >
                  Spread sweetness into communities, streamer in web3.
                </p>
                <div className="w-[80px] rounded-full md:w-[135px] h-[80px] md:h-[135px] shadow-[0_0_44px_rgba(123,123,123,0.25)] box-content inline-grid place-items-center cursor-pointer group">
                  <AnimateCandy />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ListContact />
      <Logo className="absolute inset-0 h-auto" />
      <div className="absolute top-[calc(100%-220px)] lg:top-[calc(100%-72px)] left-0 lg:left-4 z-[3] bodySmall opacity-20 flex gap-[10px] origin-top-left translate-x-[5px] -rotate-90">
        <a href="#" rel="noreferrer">
          Sugar - Spread sweetness and Happiness.
        </a>
      </div>
    </footer>
  )
}

function ListContact() {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between pt-[40px] md:pt-[25px] gap-[5px]">
      <a href="#" className="uppercase tracking-[-0.02em] font-normal hover:opacity-[0.5]">
        Sugar
      </a>
      <a href="#" className="uppercase tracking-[-0.02em] font-normal hover:opacity-[0.5]">
        Spread
      </a>
      <a
        href="#"
        target="_blank"
        rel="noreferrer"
        className="uppercase tracking-[-0.02em] font-normal hover:opacity-[0.5]"
      >
        Sweetness
      </a>
      <div>
        <a
          href="#"
          target="_blank"
          rel="noreferrer"
          className="uppercase tracking-[-0.02em] font-normal hover:opacity-[0.5]"
        >
          Happiness
        </a>
      </div>
    </div>
  )
}

function AnimateCandy() {
  const candyWrapRef = useRef<HTMLDivElement>(null)
  const currentIndexRef = useRef<number>(0)

  function animateCandy() {
    gsap.delayedCall(1.5, () => {
      const candyWrap = document.querySelector("#candyWrapFooter")

      if (candyWrap) {
        const rect = candyWrap.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0

        if (isVisible) {
          const quoteElements = document.querySelectorAll("#candyWrapFooter > svg")
          let i = currentIndexRef.current

          // Fade out current quote
          gsap.killTweensOf(quoteElements[i])
          gsap.to(quoteElements[i], {
            opacity: 0,
            ease: "power4.out",
          })

          // Move to next quote
          i++
          if (i >= quoteElements.length) {
            i = 0
          }
          currentIndexRef.current = i

          // Fade in next quote
          gsap.delayedCall(0.6, () => {
            gsap.to(quoteElements[i], {
              opacity: 1,
              ease: "power4.in",
            })
          })
        }
      }

      // Continue the cycle
      animateCandy()
    })
  }

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Initialize all quotes except the first one to be invisible
    const candys = document.querySelectorAll("#candyWrapFooter > svg")

    candys.forEach((element, index) => {
      if (index !== 0) {
        gsap.set(element, { opacity: 0 })
      } else {
        gsap.set(element, { opacity: 1 })
      }
    })

    currentIndexRef.current = 0

    // Start the animation cycle
    animateCandy()
  }, [])

  return (
    <div
      id="candyWrapFooter"
      ref={candyWrapRef}
      className="relative flex w-[100px] h-[100px] aspect-square bg-red-500 rounded-full items-center justify-center"
    >
      <Icon name="candy" className="size-[60px] absolute m-auto w-full opacity-0" />
      <Icon name="lollipop" className="size-[60px] absolute m-auto w-full opacity-0" />
      <Icon name="cupcake" className="size-[60px] absolute m-auto w-full opacity-0" />
    </div>
  )
}
