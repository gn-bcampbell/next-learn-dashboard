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

    try {

    // insert into database
    await sql
    `INSERT INTO invoices (customer_id, amount, status, date)
     VALUES (${customerId}, ${amountInCents}, ${status}, ${date}) `
    }
    catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice'
        }
    }

    // clear cache and trigger new request to server
    // once the DB is updated, this path is revalidated and fresh data will be fetched from the server
    revalidatePath('/dashboard/invoices');

    // redirect user back to this path.
    redirect('/dashboard/invoices');
}

// use zod to update expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;

    try {
        await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}`;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Invoice'
        }
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }
}