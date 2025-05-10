import { useGSAP } from "@gsap/react";
import { Icon } from "@sugar/icon";
import { cn } from "~/utils/cn";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Reference() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // initial
    gsap.set(".textAnimation", { y: "100%" });
    gsap.set(".textOpacity p", { opacity: 0, y: "50px" });

    // transition configuration
    gsap.to(".textAnimation", {
      y: 0,
      stagger: 0.2,
      scrollTrigger: {
        trigger: "#reference",
        start: "top 60%",
        end: "+=500px",
        scrub: true,
      },
    });

    document.querySelectorAll(".textOpacity p").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: "0",
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          end: "top 65%",
          scrub: true,
        },
      });
    });
  });

  return (
    <div className="px-[20px] lg:px-[50px]">
      <div id="reference" className="border-solid border-t-[1px] border-[#2F2F2F] pt-[35px]">
        <div
          className={cn("grid gap-[5px]", "md:grid-cols-[1fr_auto] md:gap-y-[0px] md:gap-x-[15px]")}
        >
          <div
            className={cn(
              "overflow-hidden rounded-[10px] h-auto",
              "md:row-span-2 md:justify-self-end md:w-[26vw]",
              "lg:w-[initial]"
            )}
          >
            <video
              className="w-full lg:w-[30vw] aspect-[370/200] object-cover h-full"
              playsInline={true}
              preload="auto"
              autoPlay={true}
              loop={true}
              muted={true}
            >
              <source
                src="https://cdn.sanity.io/files/u6q95fqm/production/db2bced0a14e9b65aa15357cae7799696903a8d4.mp4"
                type="video/mp4"
              />
            </video>
          </div>

          <span className="block text-sm mb-[10px] mt-[15px] md:m-0 md:justify-self-end">
            Together, we can spread sweetness through crypto!
          </span>

          <p className="overflow-hidden md:justify-self-end md:self-end md:mb-[-13px]">
            <span className="textAnimation text-5xl md:text-7xl lg:text-9xl uppercase block">
              In shape
            </span>
          </p>

          <p
            className={cn(
              "overflow-hidden md:col-span-2 justify-self-center",
              "md:justify-self-end md:mr-[136px] md:mt-[13px]",
              "lg:mr-[415px]"
            )}
          >
            <span className="textAnimation text-5xl md:text-7xl lg:text-9xl uppercase block">
              In his
            </span>
          </p>

          <p className="overflow-hidden md:col-span-2 justify-self-end">
            <span className="textAnimation text-5xl md:text-7xl lg:text-9xl uppercase block">
              Online
            </span>
          </p>
        </div>

        <div className="mt-[50px] md:mt-[130px] flex justify-between items-end flex-wrap gap-[40px] lg:gap-[20px]">
          <div className="textOpacity grid gap-[15px_0] max-w-[530px] text-base md:text-xl">
            <p>
              At <span className="font-cherry">Sugar</span>, we believe in the power of community
              and the joy of giving. Every gift you send is not just a transaction; it's a way to
              connect with the creators who inspire you.
            </p>
            <p>
              By gifting crypto, you're not only supporting their work but also becoming part of a
              larger movement that values creativity and collaboration.
            </p>
          </div>
          <ul className="flex gap-[15px] lg:gap-[20px]">
            <li>
              <Icon name="candy" size="xxxl" />
            </li>
            <li>
              <Icon name="cupcake" size="xxxl" />
            </li>
            <li>
              <Icon name="lollipop" size="xxxl" />
            </li>
            <li>
              <Icon name="icecream" size="xxxl" />
            </li>
            <li>
              <Icon name="donut" size="xxxl" />
            </li>
            <li>
              <Icon name="honey" size="xxxl" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
