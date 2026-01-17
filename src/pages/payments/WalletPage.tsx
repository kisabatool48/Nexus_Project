import React, { useState } from 'react';
import { CircleDollarSign, ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, History } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

interface Transaction {
    id: number;
    type: 'deposit' | 'withdrawal' | 'investment' | 'received';
    amount: number;
    date: string;
    description: string;
    status: 'completed' | 'pending' | 'failed';
}

const initialTransactions: Transaction[] = [
    {
        id: 1,
        type: 'deposit',
        amount: 5000,
        date: '2024-03-01',
        description: 'Initial Deposit',
        status: 'completed'
    },
    {
        id: 2,
        type: 'investment',
        amount: 1500,
        date: '2024-03-05',
        description: 'Investment in GreenTech Solutions',
        status: 'completed'
    },
    {
        id: 3,
        type: 'received',
        amount: 250,
        date: '2024-03-10',
        description: 'Dividend Payout',
        status: 'completed'
    }
];

export const WalletPage: React.FC = () => {
    const [balance, setBalance] = useState(3750);
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'deposit' | 'withdraw'>('deposit');
    const [amount, setAmount] = useState('');

    const handleTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) return;

        if (modalType === 'withdraw' && val > balance) {
            alert("Insufficient funds");
            return;
        }

        const newTransaction: Transaction = {
            id: transactions.length + 1,
            type: modalType === 'deposit' ? 'deposit' : 'withdrawal',
            amount: val,
            date: new Date().toISOString().split('T')[0],
            description: modalType === 'deposit' ? 'Funds Deposit' : 'Funds Withdrawal',
            status: 'completed'
        };

        setBalance(prev => modalType === 'deposit' ? prev + val : prev - val);
        setTransactions([newTransaction, ...transactions]);
        setAmount('');
        setIsModalOpen(false);
    };

    const openModal = (type: 'deposit' | 'withdraw') => {
        setModalType(type);
        setAmount('');
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-fade-in relative">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Wallet & Payments</h1>
                    <p className="text-gray-600">Manage your funds and transactions</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <Card className="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
                    <CardBody className="flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-primary-100 text-sm font-medium">Total Balance</p>
                                <h2 className="text-4xl font-bold mt-2">${balance.toLocaleString()}</h2>
                            </div>
                            <div className="p-3 bg-white/10 rounded-lg">
                                <Wallet className="text-white" size={24} />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => openModal('deposit')}
                                className="flex-1 bg-white text-primary-900 py-2 rounded-lg font-medium text-sm hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowDownLeft size={16} /> Deposit
                            </button>
                            <button
                                onClick={() => openModal('withdraw')}
                                className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-primary-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowUpRight size={16} /> Withdraw
                            </button>
                        </div>
                    </CardBody>
                </Card>

                {/* Quick Stats */}
                <Card>
                    <CardBody className="flex flex-col justify-center h-full space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-full text-green-600">
                                    <ArrowDownLeft size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Total Deposited</p>
                                    <p className="font-semibold text-gray-900">$12,450</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-full text-red-600">
                                    <ArrowUpRight size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Total Spent</p>
                                    <p className="font-semibold text-gray-900">$8,700</p>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="flex flex-col justify-center h-full">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="p-4 bg-gray-100 rounded-full">
                                <CreditCard size={32} className="text-gray-500" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Payment Methods</p>
                                <p className="text-xs text-gray-500">Visa ending in 4242</p>
                            </div>
                            <Button variant="outline" size="sm">Manage Cards</Button>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Transactions */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <History size={20} className="text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.map((t) => (
                                    <tr key={t.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className={`p-1.5 rounded-full mr-3 ${t.type === 'deposit' || t.type === 'received' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                    }`}>
                                                    {t.type === 'deposit' || t.type === 'received' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                                </div>
                                                <span className="capitalize text-sm text-gray-900">{t.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.date}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${t.type === 'deposit' || t.type === 'received' ? 'text-green-600' : 'text-gray-900'
                                            }`}>
                                            {t.type === 'deposit' || t.type === 'received' ? '+' : '-'}${t.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={t.status === 'completed' ? 'success' : 'warning'} size="sm">
                                                {t.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            {/* Simple Inline Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 capitalize">{modalType} Funds</h3>
                        <form onSubmit={handleTransaction}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    min="1"
                                    fullWidth
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button type="submit">{modalType === 'deposit' ? 'Add Funds' : 'Withdraw'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
