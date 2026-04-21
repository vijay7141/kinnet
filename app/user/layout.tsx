import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./user.css";
import { ReactNode } from "react";
 
export default function UserLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <> 

      
   <div className="dash_layout">
       <Sidebar /> 
       <div className="dash_main">
         <Header /> 
         <div className="container-fluid">
<main>{children}</main> 
         </div>
       </div>
     </div>
    </>
  );
}