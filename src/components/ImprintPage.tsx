interface ImprintPageProps {
  onClose: () => void;
}

const ImprintPage = ({ onClose }: ImprintPageProps) => {
  return (
    <main className="max-w-[700px] mx-auto px-4 py-8 font-sans">

      <button
        onClick={onClose}
        className="text-xs text-primary hover:underline mb-6 inline-block"
      >
        ← back
      </button>

      <h1 className="text-lg font-semibold text-foreground mb-1">Impressum / Imprint</h1>
      <p className="text-[0.85rem] text-muted-foreground mb-6">
        Legal disclosure pursuant to § 5 TMG (German Telemedia Act)
      </p>

      <p className="text-[0.9rem] text-foreground leading-relaxed mb-6">
        Valeria Pinto & Alexandra Brandl<br />
        10119 Berlin<br />
        Germany
      </p>

      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
        Contact
      </p>
      <p className="text-[0.9rem] text-foreground mb-6">
        Email:{" "}
        <a href="mailto:sharedgroundnews@gmail.com" className="underline underline-offset-2">
          sharedgroundnews@gmail.com
        </a>
      </p>

      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
        Responsible for content pursuant to § 18 Abs. 2 MStV
      </p>
      <p className="text-[0.9rem] text-foreground leading-relaxed mb-6">
        Valeria Pinto & Alexandra Brandl<br />
        10119 Berlin
      </p>

      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
        Disclaimer
      </p>
      <p className="text-[0.85rem] text-muted-foreground leading-relaxed">
        shared ground aggregates articles from external RSS feeds and is not
        responsible for the content of linked pages. The respective operators
        are solely responsible for the content of their sites.
      </p>

    </main>
  );
};

export default ImprintPage;
