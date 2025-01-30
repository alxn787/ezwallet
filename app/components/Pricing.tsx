/* eslint-disable */
import { FaCheck } from "react-icons/fa";

const plans = [
  {
    name: "Beta Access",
    price: "Free",
    oldPrice: "",
    benefits: [
      "10 transactions per day",
      "Send & receive money",
      "Bill payments",
      "Crypto wallet support",
      "Virtual card access",
      "Two-factor authentication",
    ],
    buttonText: "Start for Free",
    highlight: true,
  },
  {
    name: "Basic",
    price: "$2",
    oldPrice: "$3",
    benefits: [
      "20 transactions per day",
      "Send & receive money",
      "Bill payments",
      "Crypto wallet support",
      "Virtual card access",
      "Two-factor authentication",
      "Priority support",
    ],
    buttonText: "Coming Soon",
  },
  {
    name: "Advanced",
    price: "$5",
    oldPrice: "$6",
    benefits: [
      "50 transactions per day",
      "Send & receive money",
      "Bill payments",
      "Crypto wallet support",
      "Virtual card access",
      "Two-factor authentication",
      "Priority support",
      "Enhanced security",
    ],
    buttonText: "Coming Soon",
  },
  {
    name: "Premium",
    price: "$10",
    oldPrice: "$12",
    benefits: [
      "Unlimited transactions",
      "Send & receive money",
      "Bill payments",
      "Crypto wallet support",
      "Virtual card access",
      "Two-factor authentication",
      "Priority support",
      "Enhanced security",
      "Personal financial advisor",
    ],
    buttonText: "Coming Soon",
  },
];

const Pricing = () => {
  return (
    <section className="bg-black text-white py-12">
        <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                {plans.map((plan, index) => (
                <div className={` flex flex-col justify-between p-6 border rounded-xl ${
                    plan.highlight ? "border-blue-500" : "border-gray-800 "
                }`}>
                    <div
                        key={index}
                        >
                        {plan.highlight && (
                            <div className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full w-fit">
                            Popular
                            </div>
                        )}
                        <h2 className="text-2xl font-bold mt-2">{plan.name}</h2>
                        <p className="text-gray-400">
                            {plan.oldPrice && (
                            <span className="line-through text-gray-500 mr-2">
                                {plan.oldPrice}
                            </span>
                            )}
                            <span className="text-white">{plan.price}</span> /month
                        </p>
                        <ul className="mt-4 space-y-2 text-gray-400">
                            {plan.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center space-x-2">
                                <FaCheck className="text-blue-500" />
                                <span>{benefit}</span>
                            </li>
                            ))}
                        </ul>
                    </div>    
                    <div>    
                        <button
                            className={`mt-6 w-full py-2 rounded-lg text-white ${
                            plan.highlight
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-gray-800"
                            }`}
                            >
                            {plan.buttonText}
                        </button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    </section>
  );
};

export default Pricing;
