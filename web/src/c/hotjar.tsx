import { useEffect } from "react";

const HotjarTracking: React.FC = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      (function(h: any, o: any, t: string, j: string, a?: HTMLElement, r?: HTMLScriptElement) {
        h.hj = h.hj || function (...args: any[]) { (h.hj.q = h.hj.q || []).push(args); };
        h._hjSettings = { hjid: 5316679, hjsv: 6 };
        a = o.getElementsByTagName("head")[0];
        r = o.createElement("script");
        r.async = true;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);
      })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
    }
  }, []);
  return null; // No UI needed  
};

export default HotjarTracking;
