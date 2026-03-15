const AboutPage = () => (
  <main className="max-w-[700px] mx-auto px-4 py-8 font-sans">
    <div className="space-y-5 text-[0.95rem] leading-relaxed text-foreground">
      <p>
        browsing news on your terms — and being as well-informed as possible.
      </p>
      <p className="text-muted-foreground">
        in times of polarization and the rise of misinformation, shared ground lets people
        follow topics across newspapers to broaden their perspective. we move deliberately
        away from algorithmic information bubbles.
      </p>
      <p className="text-muted-foreground">
        we use AI (Claude) to build this platform — and we're honest about what that means.
        AI carries inherent bias. we're continuously auditing and improving our scraping
        approach to reduce it.
      </p>
      <p className="text-muted-foreground">
        we were torn on whether to include only progressive and left-leaning outlets.
        we decided to include conservative voices too — because being well-informed means
        understanding what's happening across the full political spectrum.
      </p>
    </div>
    <p className="mt-12 text-xs text-muted-foreground border-t border-border pt-4">
      shared ground · built by Valeria Pinto &amp; Alexandra Brandl · updated daily
    </p>
  </main>
);

export default AboutPage;
