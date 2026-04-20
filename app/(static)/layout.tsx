import "./static.css";

export default function StaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>Static Header</header>
      {children}
      <footer>Static Footer</footer>
    </>
  );
}