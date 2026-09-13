import { useSelector } from "react-redux";
import "../pages/Account.css";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router";
import app from "../firebase";
import { getPortalUrl } from "../stripe/stripePayments";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

export default function Settings() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth);

  const manageSubscription = async () => {
    try {
      const portalUrl = await getPortalUrl(app);
      window.open(portalUrl);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="settings--container">
      <h3 className="settings__title section__title">Settings</h3>
      <div className="settings__content">
        <h4 className="settings__sub-title">Your Subscription Plan</h4>
        {user.subscription === "basic" ? (
          <>
            <p className="section__para">Basic</p>
            <button className="settings__btn btn" onClick={() => navigate("/choose-plan")}>
              Upgrade to Premium
            </button>
          </>
        ) : user.subscription === "premium" ? (
          <p className="section__para">Premium</p>
        ) : (
          "Unable to Load Subscription"
        )}
      </div>

      <div className="settings__content">
        <h4 className="settings__sub-title">Email</h4>
        <p className="section__para">{user.email}</p>
      </div>

      {user.subscription === "premium" && (
        <>
          <div className="settings__content">
            <button
              className="settings__btn btn"
              onClick={() => {
                manageSubscription();
                setIsLoading(true);
              }}
            >
              {isLoading ? <FaSpinner className="settings__spinner" /> : "Manage Subscription"}
            </button>
          </div>

          {user.email === "guest@email.com" && (
            <div className="settings__content">
              <button
                className="settings__btn btn"
                onClick={() => {
                  navigate("/choose-plan");
                }}
              >
                See All Plans
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
