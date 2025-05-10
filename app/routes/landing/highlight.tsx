import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

export function Highlight() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // initial
    gsap.set(".textHighlight", { y: "100%" });

    // transition configuration
    gsap.to(".textHighlight", {
      y: 0,
      stagger: 0.2,
      scrollTrigger: {
        trigger: "#services",
        start: "top 60%",
        end: "+=500px",
        scrub: true,
        // markers: true,
      },
    });
  });

  return (
    <div className="px-[20px] lg:px-[50px] mt-[40px] lg:mt-[130px]">
      <div id="services" className="grid md:grid-cols-[1fr_auto_auto_1fr] gap-x-[15px] gap-y-[5px]">
        {/* <span className="absolute hidden md:block mt-[13px] right-[50px]">
          <span>Our services</span>
        </span> */}

        <p className="overflow-hidden md:col-span-3">
          <span className="textHighlight text-5xl md:text-7xl lg:text-9xl block">SPREAD</span>
        </p>

        <p className="overflow-hidden md:col-start-2 md:col-end-4 justify-self-center md:justify-self-start">
          <span className="textHighlight text-5xl md:text-7xl lg:text-9xl block">SWEEETNESS</span>
        </p>

        <div className="grid grid-cols-[1fr_auto] md:col-start-2 md:col-end-5 gap-[20px] md:items-start">
          <p className="overflow-hidden justify-self-end md:justify-self-start shrink-0">
            <span className="textHighlight text-5xl md:text-7xl lg:text-9xl block">HAPPINESS</span>
          </p>

          <div className="overflow-hidden hidden md:block rounded-[10px] mb-[20px] md:mb-0 md:mt-[12px] w-[-webkit-fill-available] -order-1">
            <video
              aria-hidden="true"
              className="aspect-[370/200] object-cover w-full h-full"
              playsInline={true}
              preload="auto"
              autoPlay={true}
              loop={true}
              muted={true}
            >
              <source
                src="https://cdn.sanity.io/files/u6q95fqm/production/c0594d11b2a34d37493ac112d3cb8d1d315a129e.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}
