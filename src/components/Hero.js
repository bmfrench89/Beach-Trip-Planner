'use client';

import SearchForm from '@/components/SearchForm';

export default function Hero() {
    return (
        <div className="hero">
            <div className="container">
                <div className="hero-content">
                    <h1>Plan the Ultimate<br />Beach Trip</h1>
                    <p className="subtitle">
                        Find the perfect spot for 7 adults, 5 kids, and 2 babies.<br />
                        Compare Hotels & VRBOs in NC & SC.
                    </p>
                </div>
                <div className="hero-form">
                    <SearchForm />
                </div>
            </div>

            <style jsx>{`
        .hero {
          width: 100%;
          padding: 40px 0;
        }

        .hero .container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }

        h1 {
          font-size: 4.5rem;
          margin-bottom: 24px;
          letter-spacing: -0.03em;
          color: #fff;
        }

        .subtitle {
          font-size: 1.25rem;
          color: #94a3b8;
          line-height: 1.6;
          max-width: 500px;
        }

        @media (max-width: 968px) {
          .hero .container {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .hero-content {
            margin-bottom: 40px;
          }

          .subtitle {
            margin: 0 auto;
          }

          .hero-form {
            display: flex;
            justify-content: center;
          }
        }
      `}</style>
        </div>
    );
}
