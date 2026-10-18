import Script from "next/script";

const GA_ID = "G-QGXWX5CE5N";

// Google Analytics 4 through next/script (@next/third-parties is not installed).
// Render once in the root layout, inside <body>.
export function Analytics() {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
