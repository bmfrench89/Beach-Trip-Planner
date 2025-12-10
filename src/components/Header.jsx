import Link from 'next/link';
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs';

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
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-medium transition backdrop-blur-md">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <div className="bg-white rounded-full p-1">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </SignedIn>
                </div>
            </div>
        </header>
    );
}
