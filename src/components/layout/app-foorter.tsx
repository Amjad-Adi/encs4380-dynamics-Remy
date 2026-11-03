import { FaGithub } from 'react-icons/fa';

export function AppFooter() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Dynamics Toolkit.
                    Built for ENCS4380.
                </p>

                <a
                    href={import.meta.env.VITE_GITHUB_REPOSITORY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub repository"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <FaGithub className="h-4 w-4" />
                    <span>GitHub</span>
                </a>
            </div>
        </footer>
    );
}