import Link from 'next/link';
import { FileText, ArrowRight, Check, Star, ScanSearch } from 'lucide-react';

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-gray-800 tracking-tight">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            AutoResume
          </div>
          <div className="flex items-center gap-4">
            <Link href="/scanner" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              CV Scanner
            </Link>
            <Link href="/builder" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Go to Builder
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-20 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8 border border-blue-100">
            <Star className="w-3 h-3 fill-blue-700" />
            Simple, Privacy-First CV Builder
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            Create a resume that <br className="hidden md:block" />
            <span className="text-blue-600">feels like you.</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            No complex sign-ups, no paywalls, just a clean canvas to tell your professional story.
            Built to help you stand out, simply and effectively.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/builder"
              className="group bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-all text-lg shadow-md hover:shadow-lg flex items-center gap-2"
            >
              Start Building Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/scanner"
              className="group px-8 py-4 rounded-full font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-2"
            >
              <ScanSearch className="w-5 h-5" />
              Scan Existing CV
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Section - Clean Cards */}
      <section id="how-it-works" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Focused on what matters</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              We stripped away the clutter so you can focus on your content.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Real-time Editing"
              description="Type on the left, see it on the right. A split-screen view that makes editing your CV intuitive and fast."
            />
            <FeatureCard
              title="Privacy by Design"
              description="Your data lives in your browser. We don't store it on any servers, ensuring your personal info stays yours."
            />
            <FeatureCard
              title="ATS Friendly"
              description="Clean, standard formatting that Applicant Tracking Systems can read easily, increasing your chances."
            />
          </div>
        </div>
      </section>

      {/* Step by Step */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-12 text-gray-800">Ready in 3 Steps</h2>
          <div className="space-y-4">
            <StepItem number="1" text="Enter your personal details and experience." />
            <StepItem number="2" text="Customize the accent color to match your style." />
            <StepItem number="3" text="Download perfectly formatted PDF instantly." />
          </div>

          <div className="mt-12 text-center">
            <Link href="/builder" className="text-blue-600 font-semibold hover:underline text-lg">
              Build my CV &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-200 text-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} AutoResume. Crafted for clarity.
        </p>
      </footer>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string, description: string }) {
  return (
    <div className="bg-gray-50 p-8 rounded-2xl hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
      <h3 className="font-bold text-xl mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function StepItem({ number, text }: { number: string, text: string }) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto">
      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 font-bold rounded-full flex items-center justify-center">
        {number}
      </div>
      <p className="text-gray-700 font-medium">{text}</p>
    </div>
  )
}
