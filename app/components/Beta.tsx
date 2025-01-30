const BetaAccess = () => {
  return (
    <section className="bg-black text-white py-12 text-center">
      <div className="container mx-auto px-6 md:px-12">
        <div className="inline-flex items-center bg-[#192950] px-5 py-1 rounded-full text-sm text-[#61a8fb] font-medium">
          Beta Phase
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mt-4">
          Free Access During Beta
        </h2>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
          We're currently in beta, so you can try all features for free. Help us improve by providing feedback!
        </p>
      </div>
    </section>
  );
};

export default BetaAccess;