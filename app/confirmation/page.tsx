// app/confirmation/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
//import { useState } from 'react';
import { Checkout, CheckoutButton, CheckoutStatus } from '@coinbase/onchainkit/checkout';

export default function ConfirmationPage() {
    const searchParams = useSearchParams();
    const ticketId = searchParams.get('ticketId') || '';
    const ticketName = searchParams.get('name') || 'No Name Provided';
    const totalAmount = searchParams.get('price') || '0.00';
    const userName = searchParams.get('userName') || '';
    const email = searchParams.get('email') || '';
    const ticketCount = parseInt(searchParams.get('ticketCount') || '1', 10);
   // const [chargeId, setChargeId] = useState<string | null>(null);

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
                        ticketCount,
                        ticketType: ticketName,
                    },
                }),
            });

            const data = await response.json();
            if (data.chargeId) {
                // Update inventory in Airtable after successful charge creation
                const updateInventoryResponse = await fetch('/api/updateInventory', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ticketId, quantity: ticketCount }),
                });

                if (!updateInventoryResponse.ok) {
                    console.error('Failed to update inventory in Airtable');
                }

                return data.chargeId;
            }
            throw new Error('Charge creation failed');
        } catch (error) {
            console.error("Error creating charge:", error);
            throw error;
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-sans bg-gray-50">
            <main className="flex-grow flex flex-col items-center justify-center text-center">
                <div className="bg-background p-8 rounded-2xl shadow-lg max-w-lg w-full text-foreground">
                    <h1 className="text-3xl font-bold mb-2">Confirm Your Order</h1>
                    <p>Ticket: {ticketName}</p>
                    <p>Name: {userName}</p>
                    <p>Email: {email}</p>
                    <p>Tickets: {ticketCount}</p>
                    <h2 className="text-lg font-semibold mb-4">Total: {totalAmount} USDC</h2>

                    <Checkout chargeHandler={handleCreateCharge}>
                        <div className="flex flex-col items-center">
                            <CheckoutButton coinbaseBranded text="Pay with Crypto" className="w-50 mb-2" />
                            <CheckoutStatus />
                        </div>
                    </Checkout>
                </div>
            </main>
        </div>
    );
}
