import Link from 'next/link';

const CheckIcon = () => (
  <svg className="w-8 h-8 text-[#5c7cfa] mb-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const Hero = () => (
  <div className="bg-[#0a0a0f] text-white py-20 text-center px-4">
    <h1 className="text-4xl font-bold">InvoiceNudge</h1>
    <p className="text-xl mt-4 text-gray-300">Automate your invoicing and collections with InvoiceNudge.</p>
    <div className="mt-8 flex justify-center gap-4">
      <Link href="/signup" className="bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white py-3 px-6 rounded-md transition">
        Get Started Free
      </Link>
      <Link href="/login" className="bg-zinc-600 hover:bg-zinc-500 text-white py-3 px-6 rounded-md transition">
        Sign In
      </Link>
    </div>
  </div>
);

const FeaturesGrid = () => (
  <div className="bg-zinc-800 text-white py-16 text-center px-4">
    <h2 className="text-3xl font-bold mb-8">Why InvoiceNudge?</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div className="bg-zinc-700 p-6 rounded-lg">
        <CheckIcon />
        <h3 className="text-xl font-bold">Scheduled Reminders</h3>
        <p className="text-gray-300 mt-2">Automate reminders for clients to pay on time.</p>
      </div>
      <div className="bg-zinc-700 p-6 rounded-lg">
        <CheckIcon />
        <h3 className="text-xl font-bold">Client Portal</h3>
        <p className="text-gray-300 mt-2">Track invoices and manage clients from a simple web interface.</p>
      </div>
      <div className="bg-zinc-700 p-6 rounded-lg">
        <CheckIcon />
        <h3 className="text-xl font-bold">Integration</h3>
        <p className="text-gray-300 mt-2">Integrate with popular invoicing tools for seamless data flow.</p>
      </div>
    </div>
  </div>
);

const HowItWorks = () => (
  <div className="bg-zinc-900 text-white py-16 text-center px-4">
    <h2 className="text-3xl font-bold mb-8">How It Works</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      <div className="bg-zinc-800 p-6 rounded-lg">
        <div className="bg-[#5c7cfa] text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">1</div>
        <h3 className="text-xl font-bold">Create Invoices</h3>
        <p className="text-gray-300 mt-2">Set due dates and send invoices to your clients.</p>
      </div>
      <div className="bg-zinc-800 p-6 rounded-lg">
        <div className="bg-[#5c7cfa] text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">2</div>
        <h3 className="text-xl font-bold">Automate Reminders</h3>
        <p className="text-gray-300 mt-2">InvoiceNudge will send polite reminders to your clients.</p>
      </div>
      <div className="bg-zinc-800 p-6 rounded-lg">
        <div className="bg-[#5c7cfa] text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">3</div>
        <h3 className="text-xl font-bold">Track Payments</h3>
        <p className="text-gray-300 mt-2">View payment status and outstanding amounts in your dashboard.</p>
      </div>
    </div>
  </div>
);

const Pricing = () => (
  <div className="bg-zinc-800 text-white py-16 text-center px-4">
    <h2 className="text-3xl font-bold mb-8">Pricing</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div className="bg-zinc-700 p-6 rounded-lg">
        <h3 className="text-xl font-bold">Free Tier</h3>
        <p className="text-3xl font-bold mt-2">$0<span className="text-sm text-gray-400">/mo</span></p>
        <p className="text-gray-300 mt-2">Unlimited invoices, basic reminders, and client portal access.</p>
        <div className="mt-6">
          <Link href="/signup" className="bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white py-3 px-6 rounded-md transition">
            Get Started Free
          </Link>
        </div>
      </div>
      <div className="bg-zinc-700 p-6 rounded-lg border border-[#5c7cfa]">
        <h3 className="text-xl font-bold">Pro Tier</h3>
        <p className="text-3xl font-bold mt-2">$9<span className="text-sm text-gray-400">/mo</span></p>
        <p className="text-gray-300 mt-2">Advanced features, priority support, and more.</p>
        <div className="mt-6">
          <Link href="/signup" className="bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white py-3 px-6 rounded-md transition">
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const Footer = () => (
  <div className="bg-[#0a0a0f] text-white py-8 text-center">
    <Link href="/signup" className="bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white py-3 px-6 rounded-md transition">
      Start for free today
    </Link>
  </div>
);

export default function LandingPage() {
  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      <Hero />
      <FeaturesGrid />
      <HowItWorks />
      <Pricing />
      <Footer />
    </div>
  );
}