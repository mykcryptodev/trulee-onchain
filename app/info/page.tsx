// app/info/page.tsx
'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

const InfoPage = dynamic(() => Promise.resolve(InfoPageContent), { ssr: false });

function InfoPageContent() {
    const searchParams = useSearchParams();
    const ticketId = searchParams.get('ticketId') || '';
    const ticketName = searchParams.get('name') || 'No Name Provided';
    const price = parseFloat(searchParams.get('price') || '0.50');
    const imageUrl = searchParams.get('imageUrl') || '';
    const description = searchParams.get('description') || '';
    const inventory = parseInt(searchParams.get('inventory') || '0', 10);

    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [ticketCount, setTicketCount] = useState(1);
    const router = useRouter();

    const totalAmount = (ticketCount * price).toFixed(2);

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value);
    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handleShippingAddressChange = (e: ChangeEvent<HTMLInputElement>) => setShippingAddress(e.target.value);
    const handleTicketCountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const count = Math.min(Number(e.target.value), inventory);
        setTicketCount(count);
    };

    const handleConfirm = () => {
        router.push(`/confirmation?ticketId=${ticketId}&name=${ticketName}&price=${totalAmount}&userName=${userName}&email=${email}&shippingAddress=${shippingAddress}&ticketCount=${ticketCount}`);
    };

    return (
        <Suspense fallback={<div>Loading ticket information...</div>}>
            <div className="flex flex-col min-h-screen font-sans bg-gray-50">
                <main className="flex-grow flex flex-col items-center justify-center text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full">
                        <h1 className="text-3xl font-bold mb-2">Enter Your Information</h1>
                        {imageUrl && (
                            <Image src={imageUrl} alt="Event" width={500} height={300} className="rounded-lg mb-4" />
                        )}
                        <p>{description}</p>
                        <p>Ticket: {ticketName}</p>
                        <p>Price per Ticket: {price} USDC</p>

                        <label className="block mt-4">Name</label>
                        <input type="text" placeholder="Your Name" value={userName} onChange={handleNameChange} className="p-2 border rounded w-full mb-2" />

                        <label className="block">Email</label>
                        <input type="email" placeholder="Your Email" value={email} onChange={handleEmailChange} className="p-2 border rounded w-full mb-2" />

                        <label className="block">Shipping Address</label>
                        <input type="text" placeholder="Your Shipping Address" value={shippingAddress} onChange={handleShippingAddressChange} className="p-2 border rounded w-full mb-2" />

                        <label className="block">Quantity (Max: {inventory})</label>
                        <input type="number" min="1" max={inventory} value={ticketCount} onChange={handleTicketCountChange} className="p-2 border rounded w-full mb-2" />

                        <h2 className="text-lg font-semibold mt-4">Total: {totalAmount} USDC</h2>

                        <button onClick={handleConfirm} className="bg-[#105EFF] text-white px-6 py-3 rounded mt-4">
                            Confirm
                        </button>
                    </div>
                </main>
            </div>
        </Suspense>
    );
}

export default InfoPage;
