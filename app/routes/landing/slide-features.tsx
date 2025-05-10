import { useGSAP } from "@gsap/react";
import { Icon } from "@sugar/icon";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { cn } from "~/utils/cn";

export function SlideFeatures() {
  const quotesWrapRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef<number>(0);

  // Internal quotes data
  const quotes = ["The greatest gift", "Be a loyal supporter", "Support build a vibrant community"];

  function animateQuotes() {
    gsap.delayedCall(1.5, () => {
      const quotesWrap = document.querySelector("#quotesWrap");

      if (quotesWrap) {
        const rect = quotesWrap.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
          const quoteElements = document.querySelectorAll("#quotesWrap > div > h2");
          let i = currentIndexRef.current;

          // Fade out current quote
          gsap.killTweensOf(quoteElements[i]);
          gsap.to(quoteElements[i], {
            opacity: 0,
            x: "-20px",
            ease: "power4.in",
          });

          // Move to next quote
          i++;
          if (i >= quoteElements.length) {
            i = 0;
          }
          currentIndexRef.current = i;

          // Set position for next quote
          gsap.set(quoteElements[i], {
            x: "20px",
          });

          // Fade in next quote
          gsap.delayedCall(0.6, () => {
            gsap.to(quoteElements[i], {
              opacity: 1,
              x: "0px",
              ease: "power4.out",
            });
          });
        }
      }

      // Continue the cycle
      animateQuotes();
    });
  }

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize all quotes except the first one to be invisible
    const quoteElements = document.querySelectorAll("#quotesWrap > div > h2");

    quoteElements.forEach((element, index) => {
      if (index !== 0) {
        gsap.set(element, { opacity: 0, x: "20px" });
      } else {
        gsap.set(element, { opacity: 1, x: "0px" });
      }
    });

    currentIndexRef.current = 0;

    // Start the animation cycle
    animateQuotes();
  }, []);

  return (
    <div
      id="quotesWrap"
      ref={quotesWrapRef}
      className={cn("flex flex-row items-center px-[20px] lg:px-[50px] py-[50px]")}
    >
      <div className="relative pointer-events-auto text-center w-full grow">
        {quotes.map((quote, index) => (
          <h2
            key={index}
            className={cn(
              "text-6xl text-center md:text-left",
              index === 0 ? "" : "absolute top-0 opacity-0"
            )}
          >
            {quote}
          </h2>
        ))}
        {/* <button>try on</button> */}
      </div>

      {/* <div className="h-[100px] aspect-square bg-red-500 rounded-full" /> */}
      <AnimateCandy />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Animating Candy                              */
/* -------------------------------------------------------------------------- */
function AnimateCandy() {
  const candyWrapRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef<number>(0);

  function animateCandy() {
    gsap.delayedCall(1.5, () => {
      const candyWrap = document.querySelector("#candyWrap");

      if (candyWrap) {
        const rect = candyWrap.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
          const quoteElements = document.querySelectorAll("#candyWrap > svg");
          let i = currentIndexRef.current;

          // Fade out current quote
          gsap.killTweensOf(quoteElements[i]);
          gsap.to(quoteElements[i], {
            opacity: 0,
            ease: "power4.out",
          });

          // Move to next quote
          i++;
          if (i >= quoteElements.length) {
            i = 0;
          }
          currentIndexRef.current = i;

          // Fade in next quote
          gsap.delayedCall(0.6, () => {
            gsap.to(quoteElements[i], {
              opacity: 1,
              ease: "power4.in",
            });
          });
        }
      }

      // Continue the cycle
      animateCandy();
    });
  }

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize all quotes except the first one to be invisible
    const candys = document.querySelectorAll("#candyWrap > svg");

    candys.forEach((element, index) => {
      if (index !== 0) {
        gsap.set(element, { opacity: 0 });
      } else {
        gsap.set(element, { opacity: 1 });
      }
    });

    currentIndexRef.current = 0;

    // Start the animation cycle
    animateCandy();
  }, []);

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
  );
}
