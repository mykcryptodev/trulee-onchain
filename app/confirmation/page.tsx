// app/confirmation/page.tsx
'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Checkout, CheckoutButton, CheckoutStatus } from '@coinbase/onchainkit/checkout';
import type { LifecycleStatus } from '@coinbase/onchainkit/checkout';

const ConfirmationPage = dynamic(() => Promise.resolve(ConfirmationPageContent), { ssr: false });

function ConfirmationPageContent() {
    const searchParams = useSearchParams();
    const ticketId = searchParams.get('ticketId') || '';
    const ticketName = searchParams.get('name') || 'No Name Provided';
    const totalAmount = searchParams.get('price') || '0.00';
    const userName = searchParams.get('userName') || '';
    const email = searchParams.get('email') || '';
    const shippingAddress = searchParams.get('shippingAddress') || '';
    const ticketCount = parseInt(searchParams.get('ticketCount') || '1', 10);

    const handleStatus = async (status: LifecycleStatus) => {
        const { statusName } = status;
        
        if (statusName === 'success') {
            // Decrement inventory only after successful payment
            try {
                await fetch('/api/updateInventory', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        ticketId, 
                        quantity: ticketCount, 
                        action: 'decrease' 
                    }),
                });
            } catch (error) {
                console.error('Failed to decrement inventory:', error);
                // You might want to add error handling here
            }
        }
    };

    const handleCreateCharge = async () => {
        try {
            const response = await fetch('/api/createCharge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: totalAmount,
                    metadata: {
                        name: userName,
                        email,
                        shippingAddress,
                        ticketCount,
                        ticketType: ticketName,
                    },
                }),
            });

            const data = await response.json();
            if (data.chargeId) {
                return data.chargeId;
            }
            throw new Error('Charge creation failed');
        } catch (error) {
            console.error("Error creating charge:", error);
            throw error;
        }
    };

    return (
        <Suspense fallback={<div>Loading confirmation...</div>}>
            <div className="flex flex-col min-h-screen font-sans bg-gray-50">
                <main className="flex-grow flex flex-col items-center justify-center text-center">
                    <div className="bg-background p-8 rounded-2xl shadow-lg max-w-lg w-full text-foreground">
                        <h1 className="text-3xl font-bold mb-2">Confirm Your Order</h1>
                        <p>Ticket: {ticketName}</p>
                        <p>Name: {userName}</p>
                        <p>Email: {email}</p>
                        <p>Shipping Address: {shippingAddress}</p>
                        <p>Quantity: {ticketCount}</p>
                        <h2 className="text-lg font-semibold mb-4">Total: {totalAmount} USDC</h2>

                        <Checkout 
                            chargeHandler={handleCreateCharge}
                            onStatus={handleStatus}
                        >
                            <div className="flex flex-col items-center">
                                <CheckoutButton coinbaseBranded text="Pay with Crypto" className="w-50 mb-2" />
                                <CheckoutStatus />
                            </div>
                        </Checkout>
                    </div>
                </main>
            </div>
        </Suspense>
    );
}

export default ConfirmationPage;
