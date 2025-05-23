import { Logo } from "./logo";
import { TextDesc } from "./text-desc";
import { SlideFeatures } from "./slide-features";
import { Reference } from "./reference";
import { Teams } from "./teams";
import { Highlight } from "./highlight";
import { Footer } from "~/components/layouts/footer";
import type { Route } from "./+types";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getSocialMetas } from "~/utils/seo";

export function meta({}: Route.MetaArgs) {
  return [
    ...getSocialMetas({
      title: "Sugar",
      description: "Sugar - Spread sweetness into communities, streamer in web3.",
      path: "/",
    }),
  ];
}

export default function LandingPage() {
  useGSAP(() => {
    gsap.set(".animatedText", { transformOrigin: "0% 0%", y: "100%", rotate: "20deg" });

    gsap.to(
      ".animatedText",
      {
        y: "0",
        rotate: "0deg",
        duration: 0.8,
        stagger: 0.1,
        immediateRender: !0,
        delay: 0.2,
        ease: "power3.out",
      }
      // "<"
    );
  });

  return (
    <>
      <div
        id="content"
        className="relative px-[20px] lg:px-[50px] py-[25px] lg:h-screen lg:grid lg:grid-rows-[1fr_auto]"
      >
        {/* <h1 className="max-w-[200px] lg:max-w-fit lg:ml-auto lg:mr-0 text-6xl">
          <div className="lg:overflow-hidden">
            <span className="head inline-block uppercase">SPREAD</span>
            <br />
          </div>
          <div className="lg:overflow-hidden">
            <span className="head inline-block uppercase">HAPPY SWEET</span>
          </div>
        </h1> */}
        <div className="mt-[100px] lg:mt-0 grid lg:grid-cols-3 items-end self-end mb-10">
          <div className="text-[20px] lg:max-w-[345px]">
            <p>Spread sweetness into communities,</p>
            <p>streamer in web3</p>
          </div>
          <p className="hidden relative lg:block justify-self-center italic">(scroll down)</p>
        </div>
        <Logo />
      </div>
      <TextDesc />
      <SlideFeatures />
      <Reference />
      <Teams />
      <Highlight />
      <Footer />
    </>
  );
}

function Balloon() {
  return (
    <svg
      width="876"
      height="904"
      viewBox="0 0 876 904"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M559.724 76.1596C583.56 52.3232 622.207 52.3232 646.043 76.1596L727.84 157.956C751.677 181.793 751.677 220.439 727.84 244.276L646.043 326.073C622.207 349.909 583.56 349.909 559.724 326.073L477.927 244.276C454.091 220.439 454.091 181.793 477.927 157.956L559.724 76.1596Z"
        fill="#77C6B3"
      />
      <path
        d="M395.044 43.1596C418.881 19.3232 457.527 19.3232 481.364 43.1596L563.16 124.956C586.997 148.793 586.997 187.439 563.16 211.276L481.364 293.073C457.527 316.909 418.881 316.909 395.044 293.073L313.248 211.276C289.411 187.439 289.411 148.793 313.248 124.956L395.044 43.1596Z"
        fill="#EC5212"
      />
      <path
        d="M228.755 76.1596C252.592 52.3232 291.238 52.3232 315.075 76.1596L396.871 157.956C420.708 181.793 420.708 220.439 396.871 244.276L315.075 326.073C291.238 349.909 252.592 349.909 228.755 326.073L146.958 244.276C123.122 220.439 123.122 181.793 146.958 157.956L228.755 76.1596Z"
        fill="#FFD37D"
      />
      <path
        d="M163.778 142.109C195.02 110.867 245.673 110.867 276.915 142.109L384.125 249.318C415.367 280.56 415.367 331.213 384.125 362.455L276.915 469.665C245.673 500.907 195.02 500.907 163.778 469.665L56.5686 362.455C25.3266 331.214 25.3266 280.56 56.5685 249.318L163.778 142.109Z"
        fill="#FFBABA"
      />
      <path
        d="M381.729 172.109C412.971 140.867 463.625 140.867 494.867 172.109L602.076 279.318C633.318 310.56 633.318 361.213 602.076 392.455L494.867 499.665C463.625 530.907 412.971 530.907 381.729 499.665L274.52 392.455C243.278 361.214 243.278 310.56 274.52 279.318L381.729 172.109Z"
        fill="#383030"
      />
      <path
        d="M598.884 142.109C630.126 110.867 680.779 110.867 712.021 142.109L819.231 249.318C850.473 280.56 850.473 331.213 819.231 362.455L712.021 469.665C680.779 500.907 630.126 500.907 598.884 469.665L491.674 362.455C460.432 331.214 460.432 280.56 491.674 249.318L598.884 142.109Z"
        fill="#FFBABA"
      />
      <path
        d="M567.709 261.614C592.901 236.422 633.745 236.422 658.937 261.614L745.386 348.063C770.578 373.255 770.578 414.099 745.386 439.291L658.937 525.739C633.745 550.931 592.901 550.931 567.709 525.739L481.261 439.291C456.069 414.099 456.069 373.255 481.261 348.063L567.709 261.614Z"
        fill="#FFD37D"
      />
      <path
        d="M392.608 291.614C417.8 266.422 458.644 266.422 483.836 291.614L570.284 378.063C595.476 403.255 595.476 444.099 570.284 469.291L483.836 555.739C458.644 580.931 417.8 580.931 392.608 555.739L306.159 469.291C280.967 444.099 280.967 403.255 306.159 378.063L392.608 291.614Z"
        fill="#70A2E1"
      />
      <path
        d="M216.862 261.614C242.053 236.422 282.898 236.422 308.09 261.614L394.538 348.063C419.73 373.255 419.73 414.099 394.538 439.291L308.09 525.739C282.898 550.931 242.053 550.931 216.861 525.739L130.413 439.291C105.221 414.099 105.221 373.255 130.413 348.063L216.862 261.614Z"
        fill="#77C6B3"
      />
      <circle
        cx="438"
        cy="896"
        r="6"
        transform="rotate(90 438 896)"
        stroke="#383030"
        stroke-width="4"
      />
      <circle
        cx="438"
        cy="550"
        r="6"
        transform="rotate(90 438 550)"
        stroke="#383030"
        stroke-width="4"
      />
      <path d="M437.986 890.5V554.556" stroke="#2F2D2D" stroke-width="4" />
      <path
        d="M438 259.061V272.568L437.919 272.507L408.252 294.033L378.606 272.507L348.939 294.033L319.273 272.507L289.626 294.033L260 272.527V259.041L289.626 280.526L319.273 259L348.939 280.526L378.606 259L408.252 280.526L437.919 259L438 259.061Z"
        fill="white"
      />
      <path
        d="M438 294.803V308.31L437.919 308.249L408.252 329.775L378.606 308.249L348.939 329.775L319.273 308.249L289.626 329.775L260 308.269V294.783L289.626 316.288L319.273 294.742L348.939 316.288L378.606 294.742L408.252 316.288L437.919 294.742L438 294.803Z"
        fill="white"
      />
      <path
        d="M438 330.564V344.05L437.919 343.99L408.252 365.516L378.606 343.99L348.939 365.516L319.273 343.99L289.626 365.516L260 344.03V330.523L289.626 352.029L319.273 330.503L348.939 352.029L378.606 330.503L408.252 352.029L437.919 330.503L438 330.564Z"
        fill="white"
      />
      <path
        d="M616 259.061V272.568L615.919 272.507L586.252 294.033L556.606 272.507L526.939 294.033L497.273 272.507L467.626 294.033L438 272.527V259.041L467.626 280.526L497.273 259L526.939 280.526L556.606 259L586.252 280.526L615.919 259L616 259.061Z"
        fill="white"
      />
      <path
        d="M616 294.803V308.31L615.919 308.249L586.252 329.775L556.606 308.249L526.939 329.775L497.273 308.249L467.626 329.775L438 308.269V294.783L467.626 316.288L497.273 294.742L526.939 316.288L556.606 294.742L586.252 316.288L615.919 294.742L616 294.803Z"
        fill="white"
      />
      <path
        d="M616 330.564V344.05L615.919 343.99L586.252 365.516L556.606 343.99L526.939 365.516L497.273 343.99L467.626 365.516L438 344.03V330.523L467.626 352.029L497.273 330.503L526.939 352.029L556.606 330.503L586.252 352.029L615.919 330.503L616 330.564Z"
        fill="white"
      />
    </svg>
  );
}
