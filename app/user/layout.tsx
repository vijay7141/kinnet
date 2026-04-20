import "./user.css";
import { ReactNode } from "react";
 
export default function UserLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <header className="user_header">
 
      </header>

      <main>{children}</main>

      <footer className="user_footer">
        <p>User Footer</p>
      </footer>
    </>
  );
}