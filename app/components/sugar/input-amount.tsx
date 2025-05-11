import { Input } from "@shadcn/input"
import { cn } from "~/utils/cn"

export function InputAmount({ className, onChange, ...props }: React.ComponentProps<"input">) {
  const handleSanitizedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value

    // Allow empty input
    if (raw === "") {
      e.target.value = ""
      return onChange?.(e)
    }

    // Disallow invalid formats
    if (!/^\d*\.?\d*$/.test(raw)) return

    // Clean leading zeros unless it's '0.'
    if (raw.startsWith("0") && !raw.startsWith("0.")) {
      raw = raw.replace(/^0+/, "")
      if (raw === "") raw = "0"
    }

    // Limit decimal digits to 18
    const [intPart, decimalPart] = raw.split(".")
    if (decimalPart && decimalPart.length > 18) return

    // Override input value to clean version
    e.target.value = decimalPart !== undefined ? `${intPart}.${decimalPart}` : intPart
    onChange?.(e)
  }

  return (
    <Input
      type="number"
      inputMode="decimal"
      className={cn(
        "dark:bg-transparent dark:border-0 focus-visible:border-0 focus-visible:ring-0 md:text-4xl h-max",
        className
      )}
      onChange={handleSanitizedChange}
      {...props}
    />
  )
}
