import { FaGithub } from 'react-icons/fa';

const GITHUB_REPOSITORY_URL =
    import.meta.env.VITE_GITHUB_REPOSITORY_URL ||
    'https://github.com/Amjad-Adi/encs4380-dynamics-Remy';

export function AppFooter() {
    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row">
                <p className="text-muted-foreground text-sm">
                    © {new Date().getFullYear()} Dynamics Toolkit. Built for ENCS4380.
                </p>

                <a
                    href={GITHUB_REPOSITORY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub repository"
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
                >
                    <FaGithub className="h-4 w-4" />
                    <span>GitHub</span>
                </a>
            </div>
        </footer>
    );
}
