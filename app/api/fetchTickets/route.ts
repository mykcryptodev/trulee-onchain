// app/api/fetchTickets/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableId = process.env.AIRTABLE_TABLE_ID;

    const url = `https://api.airtable.com/v0/${baseId}/${tableId}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
    });

    const data = await response.json();

    if (data.records) {
        const tickets = data.records.map((record: any) => ({
            id: record.id,
            name: record.fields.Name,
            price: record.fields.Price,
            inventory: record.fields.Inventory || 0, // Ensure inventory is a number
            imageUrl: record.fields.Image[0]?.url || '',
            description: record.fields.Description,
        }));
        return NextResponse.json({ tickets });
    } else {
        return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
    }
}
