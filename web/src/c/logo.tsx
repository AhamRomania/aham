"use client"

import { memo } from "react"

export type LogoProps = {
    size: number
    bg: string;
    color: string;
    padding?: number
}

const LogoIcon = (props: LogoProps) => {

    const size = props.size || 60;
    const color = props.color || 'green';
    const padding = size - (size * ((props.padding||10)/100))

    return (
        <div style={{
            width: size,
            height: size,
            background: props.bg,
            borderRadius: 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <svg
                style={{
                    width: padding,
                    height: padding,
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 92 92"
                width={92}
                height={92}
                fill="none"
                {...props}
            >
                <path
                fill={color}
                d="M44.077.808v42.788H27.25V30.135h-9.135v13.461H.327V.808h43.75ZM27.25 10.423h-9.135v13.462h9.135V10.423Zm16.827 37.5v43.27H27.25V77.58h-9.135v13.612H.327V47.923h43.75ZM27.25 57.538h-9.135V71h9.135V57.538ZM48.404.808H65.23v13.461h8.654V.808h17.788v42.788H73.885V32.058H65.23v11.538H48.404V.808Zm0 47.115H65.23v13.462l4.327 5.769 4.327-5.77v-13.46h17.788v43.268H73.885V77.731L69.558 83.5l-4.327-5.77v13.462H48.404V47.923Z"
                />
            </svg>
        </div> 
    )
}
const Logo = memo(LogoIcon)
export default Logo
