export default function ReferralTable() {
  return (
     <div className="dash_table_wrap">
      <h3>Active Referrals</h3>

      <table className="dash_table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Status</th>
            <th>Urgency</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Cooper (Beagle)</td>
            <td><span className="dash_badge dark">In Review</span></td>
            <td className="dash_high">High</td>
            <td>24 Oct, 09:15</td>
          </tr>

          <tr>
            <td>Luna (Persian Cat)</td>
            <td><span className="dash_badge blue">Incoming</span></td>
            <td className="dash_stable">Stable</td>
            <td>24 Oct, 08:30</td>
          </tr>

          <tr>
            <td>Rex (Retriever)</td>
            <td><span className="dash_badge gray">Claimed</span></td>
            <td className="dash_moderate">Moderate</td>
            <td>23 Oct, 16:45</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}