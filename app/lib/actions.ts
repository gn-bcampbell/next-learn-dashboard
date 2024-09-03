'use server'
import {z} from 'zod'
import {sql} from '@vercel/postgres'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


// Use zod to create a form schema - coerce form 'amount' from string to number
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
})

// remove certain keys
const CreateInvoice = FormSchema.omit({id: true, date: true})

// if using a form with many fields, using Object.fromEntries() is a good option
export async function createInvoice(formData: FormData){
    const {customerId, amount, status} = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    })
    // account for javascript floating point errors and adjust date
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    // insert into database
    await sql
    `INSERT INTO invoices (customer_id, amount, status, date)
     VALUES (${customerId}, ${amountInCents}, ${status}, ${date}) `

    // clear cache and trigger new request to server
    // once the DB is updated, this path is revalidated and fresh data will be fetched from the server
    revalidatePath('/dashboard/invoices');

    // redirect user back to this path.
    redirect('/dashboard/invoices');
}