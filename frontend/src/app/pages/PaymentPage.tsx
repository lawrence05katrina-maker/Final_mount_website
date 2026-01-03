import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  IndianRupee,
  CheckCircle,
  CreditCard,
  QrCode,
  Smartphone,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentState {
  amount: number;
  purpose: string;
  name: string;
  email?: string;
  phone?: string;
}

export const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state as PaymentState;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [method, setMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [qrExpired, setQrExpired] = useState(false);
  const [qrTimer, setQrTimer] = useState(120); // 2 minutes
  const [qrConfirmed, setQrConfirmed] = useState(false);


  useEffect(() => {
    if (!data?.amount) navigate("/");
  }, [data, navigate]);
  useEffect(() => {
    if (method !== "upi") return;

    setQrExpired(false);
    setQrTimer(120);
    setQrConfirmed(false);

    const interval = setInterval(() => {
      setQrTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setQrExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [method]);


  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  const generateUpiQR = (amount: number) => {
    const upiId = "devasahayam@upi"; // replace with real UPI ID
    const name = "Devasahayam Mount Shrine";

    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      name
    )}&am=${amount}&cu=INR`;
  };


  const handlePayment = async () => {
    setLoading(true);

    const res = await loadRazorpay();
    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    const orderResponse = await fetch("http://localhost:5000/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: data.amount }),
    });

    const order = await orderResponse.json();

    const options = {
      key: "rzp_test_xxxxxxxx",
      amount: order.amount,
      currency: "INR",
      name: "Devasahayam Mount Shrine",
      description: data.purpose,
      order_id: order.id,
      handler: function (response: any) {
        setSuccess(true);

        setPaymentData({
          amount: data.amount,
          purpose: data.purpose,
          name: data.name,
          paymentId: response.razorpay_payment_id,
        });

        navigate("/");

      },
      prefill: {
        name: data.name,
        email: data.email,
        contact: data.phone,
      },
      theme: { color: "#15803d" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
        <Card className="max-w-md w-full border-green-200">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-700" />
            </div>
            <h2 className="text-green-800 mb-3">Payment Successful</h2>
            <p className="text-gray-700 mb-4">
              Thank you for your contribution.
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-4 text-sm">
              <p><strong>Amount:</strong> ₹{data.amount}</p>
              <p><strong>Purpose:</strong> {data.purpose}</p>
            </div>
            <Button
              className="bg-green-700 hover:bg-green-800"
              onClick={() => navigate("/")}
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-14 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

        {/* LEFT – Summary */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <IndianRupee className="w-6 h-6" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg space-y-2">
              <p><strong>Name:</strong> {data.name}</p>
              <p><strong>Purpose:</strong> {data.purpose}</p>
              <p className="text-xl font-semibold text-green-700">
                ₹ {data.amount}
              </p>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>• 100% secure payments</p>
              <p>• UPI, Cards & Net Banking supported</p>
              <p>• Instant confirmation</p>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT – Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Select Payment Method</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* UPI */}
            <div
              onClick={() => setMethod("upi")}
              className={`border rounded-lg p-4 cursor-pointer ${method === "upi" ? "border-green-600 bg-green-50" : ""
                }`}
            >
              <div className="flex items-center gap-3">
                <QrCode />
                <span className="font-medium">UPI (Google Pay / PhonePe)</span>
              </div>

              {method === "upi" && (
                <div className="mt-4 flex flex-col items-center gap-3">

                  {!qrExpired ? (
                    <>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                          generateUpiQR(data.amount)
                        )}`}
                        alt="UPI QR"
                        className="border rounded-md"
                      />

                      <p className="text-sm text-gray-600">
                        Expires in <b>{qrTimer}s</b>
                      </p>

                      <Button
                        variant="outline"
                        onClick={() => setQrConfirmed(true)}
                        className="mt-2"
                      >
                        I’ve Paid
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-red-600 font-medium">QR Code Expired</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setQrExpired(false);
                          setQrTimer(120);
                        }}
                      >
                        Generate New QR
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>


            {/* Card */}
            <div
              onClick={() => setMethod("card")}
              className={`border rounded-lg p-4 cursor-pointer ${method === "card" ? "border-green-600 bg-green-50" : ""
                }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard />
                <span className="font-medium">Credit / Debit Card</span>
              </div>
            </div>

            {/* Net Banking */}
            <div
              onClick={() => setMethod("netbanking")}
              className={`border rounded-lg p-4 cursor-pointer ${method === "netbanking" ? "border-green-600 bg-green-50" : ""
                }`}
            >
              <div className="flex items-center gap-3">
                <Building2 />
                <span className="font-medium">Net Banking</span>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={loading || (method === "upi" && !qrConfirmed)}
              className="w-full bg-green-700 hover:bg-green-800 mt-4"
            >
              {loading ? "Processing..." : "Pay Now"}
            </Button>


          </CardContent>
        </Card>
      </div>
    </div>
  );
};
