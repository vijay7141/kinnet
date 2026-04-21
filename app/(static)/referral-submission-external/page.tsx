
import Footer from "../Components/Footer/footer";
import Header from "../Components/Header/header";
import { NewrefferlsForm } from '../../user/components/NewrefferlsForm';
import "../../user/user.css";


export default function ReferralSubmissionExternalPage() {
  return (
    <main className="privacy-policy-page">
      <Header/>
      <section className="privacy-policy-shell">
        <NewrefferlsForm /> 
      </section>
      <Footer />
    </main>
  );
}
