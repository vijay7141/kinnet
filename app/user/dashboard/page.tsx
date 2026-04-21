import StatsCard from "../components/StatsCard";
import ReferralTable from "../components/ReferralTable";
import Link from "next/link";
 

export default function Dashboard() {
  return (
   
        <> 
            <div className="das_area_inner">
              <div className="first">
                <h2 className="dashboard_title">Dashboard</h2>
          <p className="dashboard_sub">Welcome back, Dr. Rodriguez.</p>
              </div>
              <div className="sec">
                  <Link href="/" className="commen_btn"> <img src="/icn/plus_icn.svg" alt="" />
New Referral</Link>
              </div>
            </div>

          <div className="row g-3 ">
            <StatsCard  /> 
          </div>

          <ReferralTable />
      </>
     
  );
}