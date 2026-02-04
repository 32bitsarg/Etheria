import { getRaceData } from '@/lib/lore';
import { LandingHeader } from '@/components/landing/LandingHeader';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const races = ['humans', 'elves', 'orcs', 'dwarves'];
    const aliases = ['h', 'e', 'o', 'd'];
    return [...races, ...aliases].map((id) => ({ id }));
}

// Map plural ID to singular capitalized filename
const IMAGE_MAP: Record<string, string> = {
    'humans': 'Human.png',
    'h': 'Human.png',
    'elves': 'Elf.png',
    'e': 'Elf.png',
    'orcs': 'Orc.png',
    'o': 'Orc.png',
    'dwarves': 'Dwarf.png',
    'd': 'Dwarf.png'
};

const ID_MAP: Record<string, string> = {
    'h': 'humans',
    'e': 'elves',
    'o': 'orcs',
    'd': 'dwarves'
};

export default async function RacePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Resolve alias
    const raceId = ID_MAP[id] || id;
    const raceData = getRaceData(raceId);

    if (!raceData) {
        notFound();
    }

    const imageName = IMAGE_MAP[id] || IMAGE_MAP[raceId] || 'Human.png';

    // Basic Markdown Rendering with Design System Integration
    const renderContent = (content: string) => {
        return content.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
                return null; // Main title handled by header
            }
            if (line.startsWith('## ')) {
                return (
                    <h2 key={index} className="section-title">
                        {line.replace('## ', '')}
                        <div className="section-divider"></div>
                    </h2>
                );
            }
            if (line.startsWith('### ')) {
                return <h3 key={index} className="sub-title">{line.replace('### ', '')}</h3>;
            }
            if (line.startsWith('> ')) {
                return (
                    <blockquote key={index} className="lore-quote">
                        {line.replace('> ', '')}
                    </blockquote>
                );
            }
            if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={index} className="emphasis-text">{line.replace(/\*\*/g, '')}</p>;
            }
            if (line.startsWith('- ')) {
                return <li key={index} className="list-item">{line.replace('- ', '')}</li>;
            }
            if (line.startsWith('**') && line.includes(':')) {
                const parts = line.split('**');
                if (parts.length >= 3) {
                    return (
                        <p key={index} className="feature-row">
                            <strong className="feature-key">{parts[1]}</strong>
                            <span className="feature-desc">{parts[2]}</span>
                        </p>
                    )
                }
            }
            if (line.trim() === '') return <div key={index} className="spacer" />;

            return <p key={index} className="body-text">{line}</p>;
        });
    };

    return (
        <main className="wiki-container">
            <style dangerouslySetInnerHTML={{
                __html: `
                .wiki-container {
                    min-height: 100vh;
                    background-color: var(--bg-primary);
                    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231c1917' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
                    color: var(--text-primary);
                    font-family: var(--font-body);
                }
                .wiki-content {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 2rem 1rem;
                }
                .back-link {
                    display: inline-flex;
                    align-items: center;
                    color: var(--primary);
                    font-family: var(--font-heading);
                    font-weight: bold;
                    margin-bottom: 2rem;
                    text-transform: uppercase;
                    transition: all 0.2s;
                    text-decoration: none;
                }
                .back-link:hover {
                    color: var(--primary-light);
                    transform: translateX(-5px);
                }
                .race-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border-medium);
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: var(--shadow-lg);
                }
                .hero-section {
                    position: relative;
                    height: 400px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    border-bottom: 4px solid var(--border-medium);
                }
                .hero-bg {
                    position: absolute;
                    inset: 0;
                    background: #000;
                }
                .hero-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: top;
                    opacity: 0.8;
                    transition: transform 10s ease;
                }
                .hero-section:hover .hero-img {
                    transform: scale(1.1);
                }
                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, var(--bg-card), transparent 80%);
                }
                .race-title {
                    position: relative;
                    font-family: var(--font-heading);
                    font-size: 4rem;
                    color: var(--primary);
                    text-shadow: 0 4px 8px rgba(0,0,0,0.8);
                    z-index: 10;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .content-body {
                    padding: 3rem;
                    line-height: 1.8;
                }
                .section-title {
                    font-family: var(--font-heading);
                    font-size: 2rem;
                    color: var(--primary);
                    margin-top: 2.5rem;
                    margin-bottom: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .section-divider {
                    height: 2px;
                    width: 100%;
                    background: linear-gradient(90deg, var(--primary), transparent);
                    opacity: 0.5;
                }
                .sub-title {
                    font-family: var(--font-heading);
                    font-size: 1.5rem;
                    color: var(--text-primary);
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    border-left: 3px solid var(--secondary);
                    padding-left: 1rem;
                }
                .lore-quote {
                    background: rgba(0,0,0,0.3);
                    border-left: 4px solid var(--primary);
                    padding: 1.5rem;
                    font-style: italic;
                    color: var(--text-secondary);
                    margin: 2rem 0;
                    border-radius: 0 8px 8px 0;
                }
                .emphasis-text {
                    font-weight: bold;
                    font-size: 1.25rem;
                    text-align: center;
                    color: var(--primary-light);
                    margin: 2rem 0;
                }
                .list-item {
                    margin-left: 1.5rem;
                    list-style-type: square;
                    color: var(--text-secondary);
                    margin-bottom: 0.5rem;
                    padding-left: 0.5rem;
                }
                .list-item::marker {
                    color: var(--primary);
                }
                .feature-row {
                    margin-bottom: 1rem;
                    display: flex;
                    gap: 0.5rem;
                    align-items: baseline;
                }
                .feature-key {
                    color: var(--primary);
                    font-family: var(--font-heading);
                    min-width: 120px;
                }
                .feature-desc {
                    color: var(--text-secondary);
                }
                .body-text {
                    color: var(--text-secondary);
                    margin-bottom: 1rem;
                    font-size: 1.1rem;
                }
                .spacer {
                    height: 1rem;
                }
                .cta-section {
                    padding: 3rem;
                    background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, var(--bg-tertiary) 100%);
                    border-top: 1px solid var(--border-medium);
                    text-align: center;
                }
                .cta-btn {
                    display: inline-block;
                    padding: 1rem 3rem;
                    background: linear-gradient(180deg, var(--primary) 0%, #b8860b 100%);
                    color: #000;
                    font-family: var(--font-heading);
                    font-weight: bold;
                    font-size: 1.25rem;
                    text-transform: uppercase;
                    border-radius: 4px;
                    transition: transform 0.2s, box-shadow 0.2s;
                    border: 1px solid #ffd700;
                    text-decoration: none;
                }
                .cta-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
                }
                @media (max-width: 768px) {
                    .race-title { font-size: 2.5rem; }
                    .content-body { padding: 1.5rem; }
                    .feature-row { flex-direction: column; gap: 0; }
                }
            `}} />

            <LandingHeader />

            <div className="wiki-content">
                <Link href="/" className="back-link">
                    ← Volver a la Portada
                </Link>

                <div className="race-card">
                    {/* Hero Image */}
                    <div className="hero-section">
                        <div className="hero-bg">
                            <img
                                src={`/assets/races/${imageName}`}
                                alt={raceData.title}
                                className="hero-img"
                            />
                        </div>
                        <div className="hero-overlay"></div>
                        <h1 className="race-title">
                            {raceData.title}
                        </h1>
                    </div>

                    <div className="content-body">
                        {renderContent(raceData.content)}
                    </div>

                    <div className="cta-section">
                        <h3 className="section-title" style={{ marginTop: 0, fontSize: '1.5rem', alignItems: 'center' }}>
                            ¿Listo para liderar a los {raceData.title}?
                        </h3>
                        <Link href="/login" className="cta-btn">
                            Reclamar Trono
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
