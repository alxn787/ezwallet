import { FaDiscord, FaFacebook } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-[#141414] text-gray-400 py-8">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-white text-xl font-semibold flex items-center space-x-2">
            <span>EZWallet</span>
          </h2>
          <p className="mt-2">Secure & seamless transactions in one place.</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} - All rights reserved</p>
          <div className="flex space-x-4 mt-4">
            <FaDiscord size={20} />
            <FaFacebook size={20} />
          </div>
        </div>

        <div>
          <h3 className="text-white font-medium">Links</h3>
          <ul className="mt-2 space-y-2">
            <li><a href="/login" className="hover:text-white">Log in</a></li>
            <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
            <li><a href="/features" className="hover:text-white">Features</a></li>
            <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
            <li><a href="/support" className="hover:text-white">Support</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-medium">Others</h3>
          <ul className="mt-2 space-y-2">
            <li>Transactions</li>
            <li>Crypto Wallets</li>
            <li>Security Tips</li>
            <li>Bank Integrations</li>
            <li>Exchange Rates</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-medium">Legal</h3>
          <ul className="mt-2 space-y-2">
            <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
            <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
