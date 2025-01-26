import useDomain, { Domain } from "@/hooks/domain";
import { Ad } from "./types";

// eslint-disable-next-line react-hooks/rules-of-hooks
export const adHref = (ad:Ad) => useDomain(Domain.Web) + `/${ad.category.slug}/${ad.slug}-${ad.id}`;