import Image from 'next/image';
import AddListingForm from './AddListingForm';

export default function Hero({ onAddListing }) {
    return (
        <div className="relative h-screen w-full flex items-center justify-center text-center text-white">
            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/hero-bg.png"
                    alt="Tropical Beach"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                    className="brightness-75" // Darken slightly for text contrast
                />
            </div>

            {/* Content */}
            <div className="z-10 px-4 max-w-4xl w-full">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg tracking-tight">
                    Organize Your Dream Trip
                </h1>
                <p className="text-xl md:text-2xl mb-12 drop-shadow-md opacity-90">
                    Found a great place on Airbnb or VRBO? <br />
                    Paste the link below to save and compare it here.
                </p>

                {/* Add Listing Board */}
                <div className="max-w-4xl mx-auto">
                    <AddListingForm onAdd={onAddListing} />
                </div>
            </div>
        </div>
    );
}
