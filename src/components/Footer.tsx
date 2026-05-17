import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/50 mt-16">
    <div className="container max-w-[1400px] mx-auto px-6 h-12 flex items-center justify-between">
      <span className="text-[11px] text-[#999]">
        © 2026 Shared Ground
        <span className="mx-1.5 text-[#ccc]">·</span>
        A global feminist news aggregator
      </span>
      <div className="flex items-center gap-0 text-[11px] text-[#999]">
        {[
          { label: "About",    to: "/about"     },
          { label: "Kontakt",  to: "/contact"   },
          { label: "Impressum", to: "/impressum" },
        ].map(({ label, to }, i) => (
          <span key={label} className="flex items-center">
            {i > 0 && <span className="mx-1.5 text-[#ccc]">·</span>}
            <Link to={to} className="hover:text-[#333] transition-colors">
              {label}
            </Link>
          </span>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
