const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_test_kqxw13RjPF3iB6",
  key_secret: "NI5KpbgjLhsNyMA7MBQE1Jh2",
});

export const orderCreation = async (req, res) => {
  const { totalPrice } = req.body;
  const payment_capture = true;
  const amount = totalPrice;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: "1234567890",
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
};

export const paymentVerification = async (req, res) => {
  const secret = "12345678";

  const crypto = require("crypto");

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    require("fs").writeFileSync(
      "payment1.json",
      JSON.stringify(req.body, null, 4)
    );
  } else {
  }
  res.json({ status: "ok" });
};
