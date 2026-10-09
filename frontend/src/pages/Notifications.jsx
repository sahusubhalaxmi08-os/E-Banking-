
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getNotifications } from "../services/bankingService.js";
import NotificationList from "../components/notifications/NotificationList";

export default function Notifications() {
  const { token } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      if (!token) {
        setNotifications([]);
        setError("Please log in to view notifications.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result = await getNotifications(token);

        if (!active) return;

        setNotifications(
          Array.isArray(result)
            ? result
            : result?.notifications || []
        );
      } catch (err) {
        if (!active) return;

        if (err.response?.status === 401) {
          setError("Your session is invalid or expired. Please log in again.");
        } else {
          setError(
            err.response?.data?.message ||
              "Unable to load notifications."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadNotifications();

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="mt-1 text-sm text-slate-500">
          Stay informed about account activity.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">
          Loading notifications...
        </p>
      ) : (
        <NotificationList notifications={notifications} />
      )}
    </div>
  );
}

