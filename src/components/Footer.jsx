export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
            <div className="container mx-auto px-6 text-center">
                <p>&copy; {new Date().getFullYear()} All rights reserved that Santino's a Fag.</p>
                <div className="flex justify-center space-x-6 mt-4">
                    <a href="#" className="hover:text-white transition">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
