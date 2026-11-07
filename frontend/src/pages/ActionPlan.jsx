
import { Link } from "react-router-dom";
import { useAccount } from "../context/AccountContext";

export default function ActionPlan() {
  const { account } = useAccount();

  return (
    <section>
      <h1>Personalized Action Plan</h1>

      {account ? (
        <>
          <p>
            Preparing recommendations for
            <strong> Account #{account.account_id}</strong>.
          </p>

          <p>
            Monthly cash flow:{" "}
            <strong>
              ${account.monthly_cashflow.toLocaleString("en-CA")}
            </strong>
          </p>

          <p>Personalized recommendations will appear here.</p>
        </>
      ) : (
        <p>
          No customer selected.{" "}
          <Link to="/overview">Select an account first.</Link>
        </p>
      )}
    </section>
  );
}