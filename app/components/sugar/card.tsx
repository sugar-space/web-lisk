import { Separator } from "@shadcn/separator";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import type { JSX } from "react";
import { cn } from "~/utils/cn";

const bgVariants = cva("", {
  variants: {
    background: {
      orange: "bg-orange",
      yellow: "bg-yellow",
      pink: "bg-pink",
      blue: "bg-blue",
      green: "bg-green",

      // orange: "bg-[#FF764A]",
      // yellow: "bg-[#FFB84F]",
      // pink: "bg-[#E97B86]",
      // blue: "bg-[#77C6D9]",
      // green: "bg-[#47B172]",

      transparent: "bg-transparent",
    },
  },
  defaultVariants: {
    background: "blue",
  },
});

type CardProps = {
  title: string;
  actions?: React.ReactNode;
  color?: VariantProps<typeof bgVariants>["background"];
  textColor?: string;
} & JSX.IntrinsicElements["div"];

export function Card({ className, children, title, color, textColor, actions }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-lg shadow-md flex flex-col",
        bgVariants({ background: color }),
        textColor ? `border-2 border-${textColor}` : "",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-row justify-between items-center px-5 pt-5",
          textColor ? `text-${textColor}` : "text-white"
        )}
      >
        <p className="font-bold text-inherit">{title}</p>
        {actions}
      </div>
      <Separator className={cn("min-h-0.5 my-5", textColor ? `bg-${textColor}` : "")} />
      <div className="pb-5 px-5">{children}</div>
    </motion.div>
  );
}
