"use client";
import { useState } from "react";

export default function Settings() {
  const [bakeryInfo, setBakeryInfo] = useState({
    name: "Sweet Treats Bakery",
    address: "123 Main St, Addis Ababa",
    phone: "+251 11 872 288",
    email: "info@bakery.com",
    logo: "",
    hours: "8:00 AM - 8:00 PM",
    taxId: "ET123456789",
  });

  const [paymentSettings, setPaymentSettings] = useState({
    methods: { cash: true, card: true, mobile: true },
    bankDetails: "Bank of Ethiopia - 123456789",
    gatewayKey: "XXXXXXXXXXXX",
  });

  const [systemSettings, setSystemSettings] = useState({
    currency: "ETB",
    taxRate: 15,
    invoiceTemplate: "Default",
    lowStockThreshold: 5,
    notifications: true,
  });

  const [staff, setStaff] = useState([
    { name: "John D.", role: "Admin", email: "john@bakery.com", active: true },
    {
      name: "Mary A.",
      role: "Cashier",
      email: "mary@bakery.com",
      active: true,
    },
  ]);

  const [misc, setMisc] = useState({
    theme: "Light",
    language: "English",
    backup: "",
  });

  // Handle input changes
  const handleChange = (section, field, value) => {
    if (section === "bakery") setBakeryInfo({ ...bakeryInfo, [field]: value });
    else if (section === "payment")
      setPaymentSettings({ ...paymentSettings, [field]: value });
    else if (section === "system")
      setSystemSettings({ ...systemSettings, [field]: value });
    else if (section === "misc") setMisc({ ...misc, [field]: value });
  };

  return (
    <div className="pro">
      <div className="settings">
        <h1>Settings</h1>

        {/* Bakery Info */}
        <div className="card-row">
          <section>
            <h2>Bakery Information</h2>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={bakeryInfo.name}
                onChange={(e) => handleChange("bakery", "name", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={bakeryInfo.address}
                onChange={(e) =>
                  handleChange("bakery", "address", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                value={bakeryInfo.phone}
                onChange={(e) =>
                  handleChange("bakery", "phone", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={bakeryInfo.email}
                onChange={(e) =>
                  handleChange("bakery", "email", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Operating Hours</label>
              <input
                type="text"
                value={bakeryInfo.hours}
                onChange={(e) =>
                  handleChange("bakery", "hours", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Tax ID</label>
              <input
                type="text"
                value={bakeryInfo.taxId}
                onChange={(e) =>
                  handleChange("bakery", "taxId", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Logo</label>
              <input
                type="file"
                onChange={(e) =>
                  handleChange("bakery", "logo", e.target.files[0])
                }
              />
            </div>
          </section>

          {/* Payment Settings */}
          <section>
            <h2>Payment Settings</h2>
            <div className="form-group">
              <label>Payment Methods</label>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={paymentSettings.methods.cash}
                    readOnly
                  />{" "}
                  Cash
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={paymentSettings.methods.card}
                    readOnly
                  />{" "}
                  Card
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={paymentSettings.methods.mobile}
                    readOnly
                  />{" "}
                  Mobile Money
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Bank Details</label>
              <input
                type="text"
                value={paymentSettings.bankDetails}
                onChange={(e) =>
                  handleChange("payment", "bankDetails", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Payment Gateway Key</label>
              <input
                type="text"
                value={paymentSettings.gatewayKey}
                onChange={(e) =>
                  handleChange("payment", "gatewayKey", e.target.value)
                }
              />
            </div>
          </section>

          {/* System Settings */}
          <section>
            <h2>System Settings</h2>
            <div className="form-group">
              <label>Currency</label>
              <input
                type="text"
                value={systemSettings.currency}
                onChange={(e) =>
                  handleChange("system", "currency", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Default Tax Rate (%)</label>
              <input
                type="number"
                value={systemSettings.taxRate}
                onChange={(e) =>
                  handleChange("system", "taxRate", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Invoice Template</label>
              <select
                value={systemSettings.invoiceTemplate}
                onChange={(e) =>
                  handleChange("system", "invoiceTemplate", e.target.value)
                }
              >
                <option>Default</option>
                <option>Classic</option>
                <option>Modern</option>
              </select>
            </div>
            <div className="form-group">
              <label>Low Stock Alert Threshold</label>
              <input
                type="number"
                value={systemSettings.lowStockThreshold}
                onChange={(e) =>
                  handleChange("system", "lowStockThreshold", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Notifications</label>
              <input
                type="checkbox"
                checked={systemSettings.notifications}
                onChange={(e) =>
                  handleChange("system", "notifications", e.target.checked)
                }
              />
            </div>
          </section>

          {/* Staff Management */}
          <section>
            <h2>Staff Management</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s, idx) => (
                  <tr key={idx}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.role}</td>
                    <td>{s.active ? "Active" : "Inactive"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Miscellaneous */}
          <section>
            <h2>Miscellaneous</h2>
            <div className="form-group">
              <label>Theme</label>
              <select
                value={misc.theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language</label>
              <select
                value={misc.language}
                onChange={(e) =>
                  handleChange("misc", "language", e.target.value)
                }
              >
                <option>English</option>
                <option>Amharic</option>
              </select>
            </div>
            <div className="form-group">
              <label>Backup / Restore</label>
              <input
                type="file"
                onChange={(e) =>
                  handleChange("misc", "backup", e.target.files[0])
                }
              />
            </div>
          </section>
        </div>
        <button className="save-btn">Save Settings</button>
      </div>
    </div>
  );
}
