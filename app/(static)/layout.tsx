import Footer from "./Components/Footer/footer";
import Header from "./Components/Header/header";
import "./static.css";
export default function StaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>
  {/* <Header /> */}
  {children}
  {/* <Footer /> */}
  </>;
}
