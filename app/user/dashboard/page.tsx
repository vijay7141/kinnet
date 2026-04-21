 
 
import StatsCard from "../components/StatsCard";
import ReferralTable from "../components/ReferralTable";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
   
        <> 
          <h2 className="dashboard_title">Dashboard</h2>
          <p className="dashboard_sub">Welcome back, Dr. Rodriguez.</p>

          <div className="row g-3 mt-2">
            <StatsCard  /> 
          </div>

          <ReferralTable />
      </>
     
  );
}