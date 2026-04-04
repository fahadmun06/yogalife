const VisualCreditCard = ({ pm }) => {
  const { card } = pm;
  
  // Choose a gradient based on the brand
  const getGradient = (brand) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return 'from-blue-600 via-blue-500 to-indigo-700';
      case 'mastercard':
        return 'from-orange-500 via-red-500 to-pink-600';
      case 'amex':
        return 'from-cyan-500 via-blue-400 to-indigo-500';
      default:
        return 'from-zinc-800 via-zinc-700 to-black';
    }
  };

  return (
    <div className={`relative w-full h-52 rounded-2xl p-6 text-white bg-gradient-to-br shadow-2xl transition-transform hover:scale-[1.02] ${getGradient(card.brand)}`}>
      {/* Chip and Signal icons */}
      <div className="flex justify-between items-start mb-8">
        <div className="w-12 h-9 bg-yellow-200/80 rounded-md relative overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0.5 opacity-30">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border border-black/20" />
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-black italic tracking-wider uppercase">{card.brand}</p>
        </div>
      </div>

      {/* Card Number */}
      <div className="mb-6">
        <p className="text-2xl font-mono tracking-[0.2em]">
          •••• •••• •••• {card.last4}
        </p>
      </div>

      {/* Card Holder and Expiry */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] text-white/60 uppercase tracking-widest mb-1">Card Holder</p>
          <p className="text-sm font-bold tracking-wider truncate w-40">
            {pm.billing_details?.name || 'VALUED CUSTOMER'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-white/60 uppercase tracking-widest mb-1">Expires</p>
          <p className="text-sm font-bold tracking-widest">
            {String(card.exp_month).padStart(2, '0')}/{String(card.exp_year).slice(-2)}
          </p>
        </div>
      </div>

      {/* Decorative dots */}
      <div className="absolute top-1/2 right-6 transform -translate-y-1/2 flex flex-col gap-1.5 opacity-20">
        <div className="w-3 h-3 rounded-full bg-white" />
        <div className="w-3 h-3 rounded-full bg-white" />
        <div className="w-3 h-3 rounded-full bg-white" />
      </div>

      {/* Reflection effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none rounded-2xl" />
    </div>
  );
};

export default VisualCreditCard;
