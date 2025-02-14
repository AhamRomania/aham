import getDomain, { Domain } from "@/c/domain";
import { Ad } from "./types";
import { format } from 'timeago.js';

export const adHref = (ad:Ad) => {
    return getDomain(Domain.Web) + `/${ad.category.slug}/${ad.slug}-${ad.id}`;
}

export function ago(v: string): string {
    let ago = format(v, 'ro');
    if (ago.indexOf('acum') === 0) {
        ago = ago.replaceAll('acum ', '');
    }
    return ago
}

export function formatMoney(money: number, currency: string) {
    switch(currency) {
        case 'EUR':
            return `€${toMoney(money)}`
        case 'LEI':
            return `${toMoney(money)}LEI`
        default:
            return toMoney(money);
    }
}

export function toMoney(cents: number): string {

    if (typeof cents !== "number" || !Number.isInteger(cents)) {
        throw new Error("Input must be an integer representing cents");
    }

    // Convert cents to dollars
    const dollars = (cents / 100).toFixed(2);

    // Add commas as thousand separators
    return dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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