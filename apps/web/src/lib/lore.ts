import fs from 'fs';
import path from 'path';

export interface RaceLore {
    id: string;
    content: string;
    title: string;
    quote: string;
}

export function getRaceLoreContent(raceId: string): string | null {
    try {
        const filePath = path.join(process.cwd(), 'public/assets/races/lore', `${raceId}.md`);

        // Fallback for monorepo structure if needed
        if (!fs.existsSync(filePath)) {
            const monorepoPath = path.join(process.cwd(), 'apps/web/public/assets/races/lore', `${raceId}.md`);
            if (fs.existsSync(monorepoPath)) {
                return fs.readFileSync(monorepoPath, 'utf8');
            }
            return null;
        }

        return fs.readFileSync(filePath, 'utf8');
    } catch (e) {
        console.error(`Failed to read lore for ${raceId}`, e);
        return null;
    }
}

export function parseLore(raceId: string, content: string): RaceLore {
    // Simple parsing
    const lines = content.split('\n');
    const title = lines[0].replace('# ', '').trim();

    const quoteMatch = content.match(/> "(.*?)"/);
    const quote = quoteMatch ? `"${quoteMatch[1]}"` : "";

    return {
        id: raceId,
        content, // Full markdown content
        title,
        quote
    };
}

export function getRaceData(raceId: string): RaceLore | null {
    const content = getRaceLoreContent(raceId);
    if (!content) return null;
    return parseLore(raceId, content);
}
