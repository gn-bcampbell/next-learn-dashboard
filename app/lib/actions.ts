'use server'
import {z} from 'zod'
import {sql} from '@vercel/postgres'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// authentication
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// Use zod to create a form schema - coerce form 'amount' from string to number
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce.number().gt(0, {
        message: 'Please enter an amount greater than $0.',
    }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.'
    }),
    date: z.string(),
})

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

// remove certain keys
const CreateInvoice = FormSchema.omit({id: true, date: true})

// if using a form with many fields, using Object.fromEntries() is a good option
// prevState = state passed by useActionState hook.
export async function createInvoice(prevState: State, formData: FormData){
    // safeParse returns object containing either success/error to help handle validation without need for try/catch
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    })

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // account for javascript floating point errors and adjust date
    // prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    console.log(validatedFields)

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

// Authentication

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}