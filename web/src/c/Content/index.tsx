import { FC } from "react";
import { marked } from 'marked';
import style from './style.module.css';

export interface ContentProps {
    from: string;
}

const HtmlContent: FC<ContentProps> = async ({from}) => {

    const content = await (await fetch(from, {cache:'no-cache'})).text()
    const html = await marked.parse(content);

    return (
        <div className={style.markdown}>
            <div dangerouslySetInnerHTML={{__html:html}}></div>
        </div>
    )
}

export default HtmlContent;