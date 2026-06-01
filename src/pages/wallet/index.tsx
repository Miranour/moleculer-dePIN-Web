import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { walletService, type WalletData } from '@/services/walletService';
import { Coins, ArrowDownRight, ArrowUpRight, Clock, CreditCard, Loader2 } from 'lucide-react';

// Use a dummy publishable key for testing
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = ({ amount, onSuccess }: { amount: number, onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const depositMutation = useMutation({
    mutationFn: walletService.deposit,
    onMutate: async (newAmount) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['wallet'] });

      // Snapshot the previous value
      const previousWallet = queryClient.getQueryData<WalletData>(['wallet']);

      // Optimistically update to the new value
      if (previousWallet) {
        queryClient.setQueryData<WalletData>(['wallet'], {
          ...previousWallet,
          balance: previousWallet.balance + newAmount,
          transactions: [
            {
              id: 'TRX-OPTIMISTIC',
              type: 'deposit',
              amount: newAmount,
              date: new Date().toISOString(),
              status: 'pending',
              description: 'Kredi Yükleme İşleniyor...'
            },
            ...previousWallet.transactions
          ]
        });
      }

      return { previousWallet };
    },
    onError: (_err, _newAmount, context) => {
      if (context?.previousWallet) {
        queryClient.setQueryData(['wallet'], context.previousWallet);
      }
      setError('Ödeme başarısız oldu. Lütfen tekrar deneyin.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
    onSuccess: () => {
      onSuccess();
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    // Mock token creation instead of real payment
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error: stripeError } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (stripeError) {
      setError(stripeError.message || 'Kart doğrulama hatası');
      setLoading(false);
      return;
    }

    // Trigger mutation (this will do the optimistic update and real update)
    depositMutation.mutate(amount);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 border border-zinc-800 bg-zinc-950 rounded-md">
        <CardElement options={{
          style: {
            base: {
              color: '#f4f4f5', // zinc-100
              fontFamily: '"Geist", sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': { color: '#71717a' } // zinc-500
            },
            invalid: {
              color: '#ef4444',
              iconColor: '#ef4444'
            }
          }
        }} />
      </div>
      
      {error && <div className="text-red-500 text-sm">{error}</div>}
      
      <Button 
        type="submit" 
        disabled={!stripe || loading || depositMutation.isPending} 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {loading || depositMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
        {amount} DPL Yükle
      </Button>
    </form>
  );
};

export default function Wallet() {
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'simulation_cost'>('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const { data: wallet, isLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: walletService.getWalletData
  });

  const filteredTransactions = wallet?.transactions.filter(t => 
    filterType === 'all' || t.type === filterType
  ) || [];

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePaymentSuccess = () => {
    alert("Ödeme başarıyla gerçekleşti! Bakiyeniz güncellendi.");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-zinc-100">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cüzdan & Ödemeler</h1>
        <p className="text-zinc-400">DPL bakiyenizi yönetin ve hesaplama kredisi satın alın.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Kolon - Bakiye ve Ödeme */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="bg-zinc-900 border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 text-primary/10">
              <Coins className="w-40 h-40" />
            </div>
            <CardHeader>
              <CardTitle className="text-zinc-400 font-medium">Mevcut Bakiye</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-white mb-2">
                {isLoading ? '...' : wallet?.balance.toLocaleString()} <span className="text-2xl text-primary font-medium">DPL</span>
              </div>
              <p className="text-sm text-zinc-500">~ ${(isLoading ? 0 : (wallet?.balance || 0) * 0.1).toFixed(2)} USD (Tahmini)</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Bakiye Yükle</CardTitle>
              <CardDescription className="text-zinc-400">Kredi kartı ile güvenli ödeme (Stripe)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-2">
                {[100, 500, 1000].map(amount => (
                  <Button 
                    key={amount}
                    variant={depositAmount === amount ? 'default' : 'outline'}
                    className={depositAmount === amount ? 'bg-primary text-primary-foreground' : 'border-zinc-800 hover:bg-zinc-800 text-zinc-300'}
                    onClick={() => setDepositAmount(amount)}
                  >
                    {amount} DPL
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  value={depositAmount} 
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="bg-zinc-950 border-zinc-800"
                  min={10}
                />
                <span className="text-zinc-500 font-medium">DPL</span>
              </div>

              <div className="pt-2">
                <Elements stripe={stripePromise}>
                  <CheckoutForm amount={depositAmount} onSuccess={handlePaymentSuccess} />
                </Elements>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sağ Kolon - İşlem Geçmişi */}
        <div className="lg:col-span-2">
          <Card className="bg-zinc-900 border-zinc-800 h-full flex flex-col">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <CardTitle>İşlem Geçmişi</CardTitle>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={filterType === 'all' ? 'secondary' : 'ghost'} 
                  onClick={() => { setFilterType('all'); setPage(1); }}
                >Tümü</Button>
                <Button 
                  size="sm" 
                  variant={filterType === 'deposit' ? 'secondary' : 'ghost'} 
                  onClick={() => { setFilterType('deposit'); setPage(1); }}
                  className="text-emerald-500 hover:text-emerald-400"
                >Yüklemeler</Button>
                <Button 
                  size="sm" 
                  variant={filterType === 'simulation_cost' ? 'secondary' : 'ghost'} 
                  onClick={() => { setFilterType('simulation_cost'); setPage(1); }}
                  className="text-rose-500 hover:text-rose-400"
                >Harcamalar</Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/50">
                    <tr>
                      <th className="px-6 py-4">Tarih</th>
                      <th className="px-6 py-4">İşlem Detayı</th>
                      <th className="px-6 py-4">Durum</th>
                      <th className="px-6 py-4 text-right">Tutar (DPL)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr><td colSpan={4} className="text-center py-8 text-zinc-500"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></td></tr>
                    ) : paginatedTransactions.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-8 text-zinc-500">İşlem bulunamadı.</td></tr>
                    ) : (
                      paginatedTransactions.map((trx) => (
                        <tr key={trx.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                          <td className="px-6 py-4 text-zinc-400 whitespace-nowrap">
                            {new Date(trx.date).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-6 py-4 font-medium text-zinc-300">
                            {trx.description}
                            <div className="text-xs text-zinc-500 font-mono mt-0.5">{trx.id}</div>
                          </td>
                          <td className="px-6 py-4">
                            {trx.status === 'pending' ? (
                              <span className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full w-fit text-xs">
                                <Clock className="w-3 h-3" /> İşleniyor
                              </span>
                            ) : trx.status === 'completed' ? (
                              <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full text-xs">Tamamlandı</span>
                            ) : (
                              <span className="text-red-500 bg-red-500/10 px-2 py-1 rounded-full text-xs">Başarısız</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right font-medium whitespace-nowrap">
                            <span className={`flex items-center justify-end gap-1 ${trx.type === 'deposit' ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {trx.type === 'deposit' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                              {trx.amount > 0 ? '+' : ''}{trx.amount}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950/30">
                  <div className="text-xs text-zinc-500">
                    Toplam {filteredTransactions.length} işlem
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="border-zinc-800 text-zinc-300"
                    >
                      Önceki
                    </Button>
                    <div className="flex items-center px-2 text-sm text-zinc-400">
                      {page} / {totalPages}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="border-zinc-800 text-zinc-300"
                    >
                      Sonraki
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
