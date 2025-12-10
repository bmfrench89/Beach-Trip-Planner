import Link from 'next/link';

export default function Header() {
    return (
        <header className="absolute top-0 w-full z-10 bg-transparent py-4">
            <div className="container mx-auto flex items-center justify-between px-6">
                <Link href="/" className="text-2xl font-bold text-white tracking-wide">
                    BeachTrip<span className="text-teal-300">.</span>
                </Link>
                <nav className="hidden md:flex space-x-8">
                    {/* Placeholder for future links */}
                </nav>
                <div className="flex items-center space-x-4">
                    <button className="text-white hover:text-teal-200 transition">Sign in</button>
                    <button className="bg-white text-teal-600 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition">
                        Sign up
                    </button>
                </div>
            </div>
        </header>
    );
}
