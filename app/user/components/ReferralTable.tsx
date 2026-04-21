export default function ReferralTable() {
  return (
     <div className="dash_table_wrap">
      <h3>Active Referrals</h3>
<div className="dash_table_scroll">
  <table className="dash_table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Status</th>
            <th>Urgency</th>
            <th>Date</th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="first_th"><img src="/patient_img1.svg" alt="" /><div className="content">
              <h4>Cooper (Beagle)</h4>
              <span>Owner: Mark Johnson</span>
              </div></td>
            <td><span className="dash_badge dark">In Review</span></td>
            <td className="dash_high">High</td>
                      <td className="date">23 Oct, 16:45</td>
                    <td className="date"><img src="/icn/eye_icn.svg" alt="" /></td>
          </tr>

          <tr>
            <td className="first_th"><img src="/patient_img2.svg" alt="" /><div className="content">
              <h4>Luna (Persian Cat)</h4>
              <span>Owner: Sarah Miller</span>
              </div></td>
            <td><span className="dash_badge blue">Incoming</span></td>
            <td className="dash_stable">Stable</td>
                        <td className="date">23 Oct, 16:45</td>
                      <td className="date"><img src="/icn/eye_icn.svg" alt="" /></td>

          </tr>

          <tr>
            <td className="first_th"><img src="/patient_img3.svg" alt="" /><div className="content">
              <h4>Rex (G. Retriever)</h4>
              <span>Owner: David Chen</span>
              </div></td>
            <td><span className="dash_badge gray">Claimed</span></td>
            <td className="dash_moderate">Moderate</td>
            <td className="date">23 Oct, 16:45</td>
                          <td className="date"><img src="/icn/eye_icn.svg" alt="" /></td>

          </tr>
        </tbody>
      </table>
</div>
    
    </div>
  );
}