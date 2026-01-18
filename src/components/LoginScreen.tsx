import { motion } from 'framer-motion';
import { useUIStore } from '../stores/uiStore';
import { ShieldCheck, ArrowRight, Sun, Moon } from 'lucide-react';

export function LoginScreen() {
    const { setCurrentView } = useUIStore();

    const toggleTheme = () => {
        const body = document.body;
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
        } else {
            body.classList.add('light-mode');
        }
    };

    const handleLogin = () => {
        setCurrentView('dashboard');
    };

    return (
        <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-background-dark light-mode:bg-background-light transition-colors duration-300">

            {/* Theme Toggle - Top Right */}
            <div className="absolute top-6 right-6 z-20">
                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-full bg-panel-dark border border-border-dark text-white hover:border-primary transition-colors shadow-sm light-mode:bg-white light-mode:text-gray-800 light-mode:border-gray-200"
                    title="Toggle Theme"
                >
                    <Sun className="w-5 h-5 hidden light-mode:block" />
                    <Moon className="w-5 h-5 block light-mode:hidden" />
                    <span className="sr-only">Toggle Theme</span>
                </button>
            </div>

            {/* Main Matte Panel */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="matte-panel p-12 flex flex-col items-center justify-center z-10 max-w-md w-full mx-4"
            >
                <div className="mb-8 p-4 bg-primary/10 rounded-2xl border border-primary/20">
                    <ShieldCheck className="w-12 h-12 text-primary" />
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Endeko Dak</h1>
                <p className="text-muted mb-10 text-center">Quote Generator Portal</p>

                <button
                    onClick={handleLogin}
                    className="matte-button-primary w-full py-4 text-lg rounded-lg flex items-center justify-center gap-2 group"
                >
                    <span>Login to Dashboard</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-8 text-sm text-muted">
                    &copy; {new Date().getFullYear()} Endeko Dak.
                </div>
            </motion.div>
        </div>
    );
}
