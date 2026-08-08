import { profile } from '../../data/site';

/**
 * The 1200x630 social preview card, captured by scripts/generate-og.mjs.
 *
 * Rendered from site.ts like everything else, so the card can never advertise
 * a stale job title. It is sized for how it is actually seen: roughly 500px
 * wide in a LinkedIn feed and a small thumbnail in chat apps — so it carries a
 * name, one line of role, and nothing that would turn to mush when shrunk.
 */
const OgCard = () => (
  <div
    className="og-card relative flex items-center gap-14 overflow-hidden bg-surface px-20"
    style={{ width: 1200, height: 630 }}
  >
    <div className="min-w-0 flex-1">
      <div className="font-mono text-[19px] uppercase tracking-[0.22em] text-accent">
        {profile.initials}
      </div>

      <h1 className="mt-7 font-display text-[76px] font-bold leading-[1.02] tracking-[-0.02em] text-ink">
        {profile.name}
      </h1>

      <p className="mt-6 text-[30px] leading-snug text-ink-2">
        AI/ML Engineer — LLM inference, RAG pipelines,
        <br />
        and production data workflows.
      </p>

      <div className="mt-12 flex items-center gap-4 font-mono text-[21px] text-ink-3">
        <span className="h-px w-14 bg-line" />
        rahulx3000.in
      </div>
    </div>

    <img
      src={profile.portrait}
      alt=""
      className="h-[430px] w-[330px] shrink-0 rounded border border-line object-cover"
    />
  </div>
);

export default OgCard;
