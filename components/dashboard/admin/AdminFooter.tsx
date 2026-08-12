export default function AdminFooter() {
    return (
        <footer className="mt-16 border-t border-outline-variant/20 px-10 py-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
                <p className="text-sm text-on-surface-variant">
                    © {new Date().getFullYear()} Colibris Ecosystem Management
                </p>

                <div className="flex gap-6">
                    <a href="/privacy-policy">Privacy Policy</a>
                    <a href="/terms&conditions">Terms</a>

                </div>
            </div>
        </footer>
    );
}