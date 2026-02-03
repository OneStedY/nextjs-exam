// components/SearchBar.tsx (server)
export default function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  return (
      <form method="GET">
        <input name="q" defaultValue={defaultValue} placeholder="Search..." />
        {/* при новом поиске логично сбрасывать page */}
        <input type="hidden" name="page" value="1" />
        <button type="submit">Search</button>
      </form>
  );
}
