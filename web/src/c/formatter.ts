import useDomain, { Domain } from "@/hooks/domain";
import { Ad } from "./types";

export const adHref = (ad:Ad) => useDomain(Domain.Web) + `/${ad.category.slug}/${ad.slug}-${ad.id}`;