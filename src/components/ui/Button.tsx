import * as React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "../../lib/utils"

export interface ButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode
    variant?: "primary" | "secondary" | "outline" | "ghost"
    size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
        const variants = {
            primary: "bg-brand-accent text-brand-black hover:bg-brand-cyan shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] border border-transparent",
            secondary: "bg-brand-dark text-white border border-white/10 hover:border-brand-accent/50 hover:text-brand-accent",
            outline: "bg-transparent text-white border border-brand-accent/50 hover:bg-brand-accent/10 hover:border-brand-accent",
            ghost: "bg-transparent text-white/70 hover:text-brand-accent hover:bg-white/5",
        }

        const sizes = {
            sm: "h-8 px-4 text-xs tracking-wider",
            md: "h-10 px-6 text-sm tracking-widest",
            lg: "h-12 px-8 text-base tracking-widest uppercase",
        }

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "relative inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-accent disabled:pointer-events-none disabled:opacity-50 overflow-hidden group",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                <span className="relative z-10 flex items-center gap-2">{children}</span>
                {variant === 'primary' && (
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out skew-y-12 origin-bottom" />
                )}
            </motion.button>
        )
    }
)
Button.displayName = "Button"

export { Button }
