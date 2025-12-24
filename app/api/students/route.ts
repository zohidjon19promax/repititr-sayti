// app/api/students/route.ts
import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

const uri = "mongodb+srv://admin:zohid2104@cluster0.7wlj02m.mongodb.net/repetitor_db?retryWrites=true&w=majority"
const client = new MongoClient(uri)

export async function GET() {
    try {
        await client.connect()
        const db = client.db('repetitor_db')
        const students = await db.collection('students').find({}).toArray()
        return NextResponse.json({ success: true, data: students })
    } catch (e) {
        return NextResponse.json({ success: false }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        await client.connect()
        const db = client.db('repetitor_db')
        await db.collection('students').insertOne(body)
        return NextResponse.json({ success: true })
    } catch (e) {
        return NextResponse.json({ success: false }, { status: 500 })
    }
}