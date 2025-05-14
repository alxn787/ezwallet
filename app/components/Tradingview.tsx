/* eslint-disable */
"use client";
import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget({ symbol } : { symbol: string }) {
  const container = useRef(null);

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "${symbol}",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "9",
          "locale": "en",
          "allow_symbol_change": true,
          "support_host": "https://www.tradingview.com"
        }`;
      if (!container.current) return;

      while (container.current.firstChild) {
        container.current.removeChild(container.current.firstChild);
      }

      container.current.appendChild(script);

      return () => {
        if (container.current && container.current.contains(script)) {
          container.current.removeChild(script);
        }
      };
    },
    [symbol]
  );

  return (
    <div className="tradingview-widget-container h-full w-full rounded-lg" ref={container} >
      <div className="tradingview-widget-container__widget rounded-lg"></div>
    </div>
  );
}
export default memo(TradingViewWidget);
