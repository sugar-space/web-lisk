import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "~/utils/cn";

export function TextDesc() {
  useGSAP(() => {
    gsap.set("#desc p", {
      opacity: 0,
      y: "50px",
    });

    document.querySelectorAll("#desc p").forEach((el) => {
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
    <div
      id="desc"
      className={cn(
        "mx-[50px] bg-[#373737]/[0.4] backdrop-blur-[100px] text-white rounded-2xl text-2xl",
        "py-[40px] px-[25px] md:p-[60px]",
        "grid md:grid-cols-2 gap-[20px] md:gap-y-[120px] grid-rows-[1fr]"
      )}
    >
      <p className="md:row-start-2 max-w-[325px] text-3xl">
        "Supporting means spreading sweetness, happiness, and love."
      </p>
      <div className="md:col-start-2 max-w-[460px] grid gap-4">
        <p>
          Welcome to <span className="font-cherry">Sugar</span>, an innovative platform designed to
          revolutionize the way you support your favorite streamers.
        </p>
        <p>
          With <span className="font-cherry">Sugar</span>, you can easily send crypto gifts that not
          only show your appreciation but also help creators thrive in their craft.
        </p>
        <p>
          Our platform supports popular cryptocurrencies like ETH, USDC, and LINK, etc. Make it
          simple for you to choose the perfect gift for the content creators you love!
        </p>
      </div>
      <div className="max-w-[460px] grid gap-4">
        <p>
          We prioritize your security and convenience. Our platform is designed to facilitate quick
          and secure transactions,
        </p>
        <p>
          so you can focus on what truly matters supporting your favorite creators without any
          hassle.
        </p>
      </div>
      {/* <p className="mt-[10px] md:mt-[60px] lg:mt-[220px]">Stories</p> */}
    </div>
  );
}
