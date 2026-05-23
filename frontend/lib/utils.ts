import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...i: Parameters<typeof clsx>) => twMerge(clsx(i));
