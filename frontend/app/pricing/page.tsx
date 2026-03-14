import Link from 'next/link';

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5 text-gray-400 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: [
      { text: 'Basic invoice tracking', included: true },
      { text: 'Up to 10 clients', included: true },
      { text: 'Limited payment reminders', included: true },
      { text: 'Advanced analytics', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '$9',
    featured: true,
    features: [
      { text: 'Advanced invoice tracking', included: true },
      { text: 'Unlimited clients', included: true },
      { text: 'Full payment reminders', included: true },
      { text: 'Advanced analytics', included: true },
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white py-16 px-4">
      <h1 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-zinc-800 p-8 rounded-lg ${plan.featured ? 'border-2 border-[#5c7cfa]' : ''}`}
          >
            <h2 className="text-xl font-bold text-center">{plan.name}</h2>
            <p className="text-3xl font-bold text-center mt-2">
              {plan.price}<span className="text-sm text-gray-400">/mo</span>
            </p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f.text} className="text-sm">
                  {f.included ? <CheckIcon /> : <XIcon />}
                  <span className={f.included ? '' : 'text-gray-500'}>{f.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 text-center">
              <Link
                href="/signup"
                className="bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white py-3 px-6 rounded-md transition inline-block"
              >
                Get Started
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}