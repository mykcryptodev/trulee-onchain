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
            'Cache-Control': 'no-store', // Ensures real-time data fetching
        },
    });

    const data = await response.json();

    interface AirtableRecord {
        id: string;
        fields: {
            Name: string;
            Price: number;
            Inventory?: number;
            Image?: { url: string }[];  // Access the first URL from the array
            Description?: string;
        };
    }

    if (data.records) {
        const tickets = data.records.map((record: AirtableRecord) => ({
            id: record.id,
            name: record.fields.Name,
            price: record.fields.Price,
            inventory: record.fields.Inventory || 0,
            imageUrl: record.fields.Image ? record.fields.Image[0].url : '', // Use first attachment URL
            description: record.fields.Description || '',
        }));
        return NextResponse.json({ tickets });
    } else {
        return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
    }
}
