"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main id="main-content" className="empty-page"><span className="section-kicker">A small interruption</span><h1>Let’s pick up<br />the <em>thread.</em></h1><p>We couldn’t load this page. Please try again.</p><button className="primary-button" onClick={reset}>Try again</button></main>;
}
