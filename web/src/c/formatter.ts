import { Ad } from "./types";

export const adHref = (ad:Ad) => `http://aham.ro/c/${ad.category.slug}/${ad.slug}-${ad.id}`;