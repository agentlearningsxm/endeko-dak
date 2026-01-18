import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useUIStore } from '../stores/uiStore';
import { useQuoteStore } from '../stores/quoteStore';
import { Plus, ArrowRight } from 'lucide-react';
import type { Quote } from '../types/blocks';
import { generateQuoteNumber } from '../lib/constants';

export function DashboardScreen() {
    const { setCurrentView } = useUIStore();
    const { savedQuotes, loadQuote, createNewQuote, addSavedQuote } = useQuoteStore();

    // Mock Data Initialization
    useEffect(() => {
        if (savedQuotes.length === 0) {
            const mockQuotes: Partial<Quote>[] = [
                {
                    clientDetails: { name: "Jansen Dakwerken", companyName: "Jansen BV", address: "", postalCode: "1000", city: "Brussels", email: "", phone: "" },
                    blocks: [
                        { id: '1', type: 'service', createdAt: new Date().toISOString(), data: { title: 'Roofing Repair', price: 1500, quantity: 1, description: 'Emergency repair', items: [], unit: 'stuks', category: 'renovatie' } },
                        { id: '2', type: 'service', createdAt: new Date().toISOString(), data: { title: 'Labor', price: 50, quantity: 8, description: 'Hours', items: [], unit: 'uur', category: 'overig' } }
                    ],
                    status: 'draft',
                    number: generateQuoteNumber()
                },
                {
                    clientDetails: { name: "Bouwbedrijf Peeters", companyName: "Peeters Construct", address: "", postalCode: "2000", city: "Antwerp", email: "", phone: "" },
                    blocks: [
                        { id: '3', type: 'service', createdAt: new Date().toISOString(), data: { title: 'Full Roof Insulation', price: 4500, quantity: 1, description: 'Materials and init', items: [], unit: 'm²', category: 'isolatie' } }
                    ],
                    status: 'sent',
                    number: generateQuoteNumber()
                },
                {
                    clientDetails: { name: "Fam. De Vries", companyName: "", address: "", postalCode: "9000", city: "Ghent", email: "", phone: "" },
                    blocks: [
                        { id: '4', type: 'service', createdAt: new Date().toISOString(), data: { title: 'Gutter Cleaning', price: 350, quantity: 1, description: 'Annual maintenance', items: [], unit: 'stuks', category: 'dakbedekking' } }
                    ],
                    status: 'accepted',
                    number: generateQuoteNumber()
                }
            ];

            // Inject mocks
            mockQuotes.forEach(mq => {
                addSavedQuote({
                    id: crypto.randomUUID(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    validityDays: 30,
                    template: 'modern',
                    notes: '',
                    blocks: [],
                    ...mq
                } as Quote);
            });
        }
    }, [savedQuotes.length, addSavedQuote]);

    const handleOpenQuote = (id: string) => {
        loadQuote(id);
        setCurrentView('builder');
    };

    const handleNewQuote = () => {
        createNewQuote();
        setCurrentView('builder');
    };

    return (
        <div className="min-h-screen w-full relative p-8 bg-background-dark light-mode:bg-background-light">

            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
                        <p className="text-muted">Manage your quotes</p>
                    </div>
                    <button
                        onClick={handleNewQuote}
                        className="matte-button-primary px-6 py-3 rounded-lg flex items-center gap-2 shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        <span>New Quote</span>
                    </button>
                </header>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="matte-panel min-h-[400px] overflow-hidden bg-panel-dark light-mode:bg-panel-light"
                >
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#14213d] light-mode:bg-gray-50">
                            <tr className="text-muted-dark light-mode:text-muted-light text-sm uppercase tracking-wider border-b border-border-dark light-mode:border-border-light">
                                <th className="p-4 font-semibold pl-6">Quote #</th>
                                <th className="p-4 font-semibold">Client</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Total</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-dark light-mode:divide-border-light">
                            {savedQuotes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted">
                                        No quotes found. Create your first quote!
                                    </td>
                                </tr>
                            ) : (
                                savedQuotes.map((quote, i) => (
                                    <motion.tr
                                        key={quote.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group hover:bg-black/5 light-mode:hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => handleOpenQuote(quote.id)}
                                    >
                                        <td className="p-4 pl-6 text-foreground font-medium">{quote.number}</td>
                                        <td className="p-4 text-muted group-hover:text-foreground transition-colors">
                                            {quote.clientDetails.name || 'Untitled Client'}
                                        </td>
                                        <td className="p-4 text-muted">
                                            {new Date(quote.updatedAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-foreground font-mono font-medium">
                                            €{quote.blocks.reduce((acc, b) => {
                                                if (b.type === 'service') {
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    const data = (b as any).data || {};
                                                    return acc + (Number(data.price || 0) * Number(data.quantity || 1));
                                                }
                                                return acc;
                                            }, 0).toFixed(2)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide border ${quote.status === 'accepted' ? 'bg-success/10 text-success border-success/20' :
                                                quote.status === 'sent' ? 'bg-primary/10 text-primary border-primary/20' :
                                                    'bg-muted-dark/10 text-muted-dark border-muted-dark/20'
                                                }`}>
                                                {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right pr-6">
                                            <button className="matte-button-ghost p-2 w-9 h-9">
                                                <span className="sr-only">Edit</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </motion.div>
            </div>
        </div>
    );
}
