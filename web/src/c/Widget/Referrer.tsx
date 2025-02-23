"use client";

import { useSearchParams } from "next/navigation";
import { FC } from "react";
import Cookies from "js-cookie";

const Referrer:FC = () => {
    const searchParams = useSearchParams();
      const referrer = searchParams.get("referrer");
      if (!Cookies.get('referrer') && referrer) {
        Cookies.set('referrer', referrer, {expires: 60})
      }
    return null;
}

export default Referrer