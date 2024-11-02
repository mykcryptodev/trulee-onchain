// app/api/updateInventory/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { ticketId, quantity, action } = await request.json();

    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableId = process.env.AIRTABLE_TABLE_ID;

    const url = `https://api.airtable.com/v0/${baseId}/${tableId}/${ticketId}`;
    // Fetch the current ticket inventory
    const ticketResponse = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
    });
    const ticketData = await ticketResponse.json();
    const currentInventory = ticketData.fields.Inventory || 0;

    // Update inventory by subtracting the purchased quantity
    const newInventory = action != 'restore' 
        ? currentInventory - quantity 
        : currentInventory + quantity;

    // Update the Airtable record with the new inventory count
    const updateResponse = await fetch(url, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fields: {
                Inventory: newInventory,
            },
        }),
    });

    if (updateResponse.ok) {
        return NextResponse.json({ success: true });
    } else {
        return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
    }
}
