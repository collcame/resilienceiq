
import { Link } from "react-router-dom";
import { useAccount } from "../context/AccountContext";

export default function Simulator() {
  const { account } = useAccount();

  return (
    <section>
      <h1>Shock Simulator</h1>

      {account ? (
        <>
          <p>
            Simulating financial resilience for
            <strong> Account #{account.account_id}</strong>.
          </p>

          <p>
            Current cash buffer:{" "}
            <strong>${account.buffer.toLocaleString("en-CA")}</strong>
          </p>

          <p>Interactive financial shock controls are coming next.</p>
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