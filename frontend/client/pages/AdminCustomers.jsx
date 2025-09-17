// client/pages/AdminCustomers.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import api from "../utils/api";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/admin/customers");
        setCustomers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers.map((c) => (
                <div key={c._id} className="border rounded-lg p-4 bg-white flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{c.name}</h3>
                    <p className="text-sm text-gray-600">{c.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Orders: {c.totalOrders || 0}</p>
                    <p className="text-sm text-gray-600">Spent: ₹{c.totalSpent || 0}</p>
                  </div>
                </div>
              ))}
              {customers.length === 0 && (
                <p className="text-center text-gray-500 py-6">No customers found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
