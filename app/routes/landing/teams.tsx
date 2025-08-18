import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export function Teams() {
  useGSAP(() => {
    gsap.set("#cards", {
      perspective: "900px",
    })

    gsap.set("#cards article", {
      transformOrigin: "top center",
    })

    document.querySelectorAll("#cards article").forEach((el, t) => {
      ScrollTrigger.create({
        trigger: el,
        start: "start 100%",
        onEnter: () => {
          gsap.set(el, {
            rotationX: "-65deg",
            z: "-500px",
            opacity: 0,
          })

          gsap.to(el, {
            rotationX: "0",
            z: "0",
            opacity: 1,
            delay: (t % 3) * 0.05,
          })
        },
      })
    })
  })

  return (
    <div
      id="teams"
      className="relative px-[20px] lg:px-[50px] py-[25px] mt-[40px] lg:mt-[130px] h-max"
    >
      <div id="gridTeams" className="grid grid-cols-1 lg:grid-cols-8 gap-8">
        <div id="encounterCursor" className="relative col-span-full lg:col-span-2">
          <p>Our Teams</p>
          <p>
            So why wait? Sign up today, explore the possibilities, and start gifting crypto to your
            favorite streamers. Together, we can spread sweetness, happiness, and love through the
            power of crypto!
          </p>
        </div>
        <div className="col-span-6">
          <div id="cards" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ITEMS.map((val, idx) => {
              return (
                <article key={idx} className="flex flex-col gap-2">
                  <img src={val.image} className="aspect-[1/1] rounded-lg object-cover" />
                  <div className="flex flex-row justify-between">
                    <p className="text-start">{val.name}</p>
                    <div className="flex flex-col items-end text-white/70">
                      <p>{val.as}</p>
                      <p>{val.from}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

const ITEMS = [
  {
    name: "Rei Yan",
    as: "Team",
    image: "https://ik.imagekit.io/happycuan/teams/673875ce11b15b80950a1116",
    from: "Sugar",
  },
  {
    name: "Rama",
    as: "Team",
    image: "https://ik.imagekit.io/happycuan/teams/673873cc11b15b80950a110a",
    from: "Sugar",
  },
  {
    name: "Johanes",
    as: "Team",
    image: "https://ik.imagekit.io/3592mo0vh/adib.png",
    from: "Sugar",
  },
  // {
  //   name: "YB",
  //   as: "Reference",
  //   image: "https://ik.imagekit.io/w0nuhbceop/a4a/ybrap.png",
  //   from: "A 4 A",
  // },
  // {
  //   name: "Tierison",
  //   as: "Reference",
  //   image: "https://ik.imagekit.io/w0nuhbceop/a4a/tierison.png",
  //   from: "A 4 A",
  // },
  // {
  //   name: "Yuka",
  //   as: "Reference",
  //   image: "https://ik.imagekit.io/w0nuhbceop/a4a/yukatheo.png",
  //   from: "A 4 A",
  // },
  // {
  //   name: "Garry",
  //   as: "Reference",
  //   image: "https://ik.imagekit.io/w0nuhbceop/a4a/garryang.png",
  //   from: "A 4 A",
  // },
  // {
  //   name: "Tepe 46",
  //   as: "Reference",
  //   image: "https://ik.imagekit.io/w0nuhbceop/a4a/tepe46.png",
  //   from: "A 4 A",
  // },
  // {
  //   name: "Niko",
  //   as: "Reference",
  //   image: "https://ik.imagekit.io/w0nuhbceop/a4a/nikojuniusss.png",
  //   from: "A 4 A",
  // },
  // {
  //   name: "Aloy",
  //   as: "Reference",
  //   image: "https://ik.imagekit.io/w0nuhbceop/a4a/aloy.png",
  //   from: "A 4 A",
  // },
  // {
  //   name: "Bravy",
  //   as: "Reference",
  //   image: "https://ik.imagekit.io/w0nuhbceop/a4a/bravyson.png",
  //   from: "A 4 A",
  // },
  // {
  //   name: "Ibot",
  //   as: "Reference",
  //   image: "https://ik.imagekit.io/w0nuhbceop/a4a/ibottt.png",
  //   from: "A 4 A",
  // },
]
