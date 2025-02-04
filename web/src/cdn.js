import getDomain, {Domain} from './c/domain';

export default function imageLoader({ src, width, quality }) {
    return getDomain(Domain.Cdn) + `/${src}?w=${width}&q=${quality || 75}`;
}