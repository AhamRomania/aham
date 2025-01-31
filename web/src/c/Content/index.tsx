import { FC } from "react";
import { marked } from 'marked';
import style from './style.module.css';

export interface ContentProps {
    from: string;
}

const Content: FC<ContentProps> = async ({from}) => {

    const content = await (await fetch(from + '?r=' + (1000 * Math.random()), {cache:'no-cache'})).text()

    return (
        <div className={style.markdown}>
            <div dangerouslySetInnerHTML={{__html:marked.parse(content)}}></div>
        </div>
    )
}

export default Content;