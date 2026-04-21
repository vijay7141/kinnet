
import Footer from "../Components/Footer/footer";
import Header from "../Components/Header/header";
import { NewrefferlsFormEx } from "../Components/NewrefferlsFormEx";
import "../../user/user.css";
import "../static.css";


export default function ReferralSubmissionExternalPage() {
  return (
    <main className="">
      <Header/>
      <section className="new-referral-pagex m-auto">
        <h1>New Referral</h1>
        <NewrefferlsFormEx />
        
      </section>
      <Footer />
    </main>
  );
}
