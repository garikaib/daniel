// The quiet green/gold/pink gradient accent used atop dark sections
// throughout the site — header, footer, hero cards — as a unifying signature
// rather than a literal flag.
export default function FlagStripe({ className = '' }) {
  return (
    <div
      className={`h-[3px] w-full bg-gradient-to-r from-[#044D29] via-[#DCA11D] to-[#C8102E] ${className}`}
    />
  );
}
