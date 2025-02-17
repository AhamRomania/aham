import getDomain, { Domain } from "@/c/domain";
import { Ad } from "./types";
import { format } from 'timeago.js';
import dayjs from "dayjs";
import "dayjs/locale/ro";
import utc from "dayjs/plugin/utc";

dayjs.locale('ro');
dayjs.extend(utc);

export const adHref = (ad:Ad) => {
    return getDomain(Domain.Web) + `/${ad.category.slug}/${ad.slug}-${ad.id}`;
}

export function ago(v: string, prefix = false): string {
    let ago = format(v, 'ro');
    if (!prefix && ago.indexOf('acum') === 0) {
        ago = ago.replaceAll('acum ', '');
    }
    return ago
}

export function dateTime(v: string): string {
    
    const now = dayjs();
    const d = dayjs(v).utc();

    if (Math.abs(d.diff(now, "hour")) <= 1) {
        return ago(v,true)
    }

    if (d.isSame(now,"day")) {
        return d.format('HH:mm');
    }

    if (d.isSame(now.subtract(1, "day"), "day")) {
        return 'Ieri ' + d.format('HH:mm');
    }

    if (d.isSame(now,"week")) {
        return d.format('dddd HH:mm');
    }

    if (d.isSame(now,"month")) {
        return d.format('D dddd HH:mm');
    }

    if (d.isSame(now,"year")) {
        return d.format('D dddd HH:mm');
    }

    return d.format('YYYY D MMMM HH:mm')
}

export function formatMoney(money: number, currency: string) {
    switch(currency) {
        case 'EUR':
            return `€${toMoney(money)}`
        case 'LEI':
	    const v = toMoney(money)
            return v+((v=="1")?'LEU':'LEI');
        default:
            return toMoney(money);
   }
}

export function toMoney(cents: number): string {
    if (typeof cents !== "number" || !Number.isInteger(cents)) {
        throw new Error("Input must be an integer representing cents: " + typeof(cents));
    }
    const dollars = (cents / 100).toFixed(2);
    return dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace('.00', '');
}

export function toCents(value: string): number {

    if (typeof value !== "string") {
        throw new Error("Input must be a string in the format '9,999.99'");
    }

    // Remove commas (thousands separators) and parse as float
    const numericValue: number = parseFloat(value.replace(/,/g, ""));

    if (isNaN(numericValue)) {
        throw new Error("Invalid number format");
    }

    // Convert to cents (multiply by 100 and round to avoid floating-point issues)
    return Math.round(numericValue * 100);
}
