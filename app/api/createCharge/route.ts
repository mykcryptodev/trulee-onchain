// app/api/createCharge/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { amount, metadata } = await req.json();

    const requestBody = {
        local_price: {
            amount: amount.toString(),
            currency: 'USD',
        },
        pricing_type: 'fixed_price',
        metadata,
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CC-Api-Key': process.env.COINBASE_COMMERCE_API_KEY || '',
        },
        body: JSON.stringify(requestBody),
    };

    const url = 'https://api.commerce.coinbase.com/charges';
    const response = await fetch(url, options);
    const data = await response.json();

    if (data && data.data && data.data.id) {
        return NextResponse.json({ chargeId: data.data.id });
    } else {
        console.error("Charge creation failed:", data);
        return NextResponse.json({ error: "Failed to create charge" }, { status: 500 });
    }
}
