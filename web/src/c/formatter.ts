import getDomain, { Domain } from "@/hooks/domain";
import { Ad } from "./types";

export const adHref = (ad:Ad) => {
    return getDomain(Domain.Web) + `/${ad.category.slug}/${ad.slug}-${ad.id}`;
}