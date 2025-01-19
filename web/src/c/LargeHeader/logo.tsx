import * as React from "react"
import { memo } from "react"

type LargeHeaderLogoProps = {
    size: number
    bg: string;
    color: string;
}

const LargeHeaderLogo = (props: LargeHeaderLogoProps) => {

    const size = props.size || 60;
    const color = props.color || 'green';

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={100} height={100}>
            <rect width={100} height={100} fill={props.bg} rx={8} />
            <path
            fill={color}
            d="M48.077 4.808v42.788H31.25V34.135h-9.135v13.461H4.327V4.808h43.75ZM31.25 14.423h-9.135v13.462h9.135V14.423ZM48.077 51.923v43.27H31.25V81.58h-9.135v13.612H4.327V51.923h43.75ZM31.25 61.538h-9.135V75h9.135V61.538ZM52.404 4.808H69.23v13.461h8.654V4.808h17.788v42.788H77.885V36.058H69.23v11.538H52.404zM52.404 51.923H69.23v13.462l4.327 5.769 4.327-5.77v-13.46h17.788v43.268H77.885V81.731L73.558 87.5l-4.327-5.77v13.462H52.404z"
            />
        </svg>
    )
}
const Memo = memo(LargeHeaderLogo)
export default Memo
