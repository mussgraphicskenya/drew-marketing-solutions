import { Fira_Sans } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { cookies } from 'next/headers';
import AdminLayout from './AdminLayout';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

const fira_sans = Fira_Sans({
    subsets: ['latin'],
    weight:  ['400', '500', '600', '700', '800'],
    variable: '--body-color-font',
});

export const metadata = {
    title: {
        default:  'Admin | Drew Marketing Solutions',
        template: '%s | Drew Admin',
    },
};

export default async function Layout({ children }) {
    // Check auth cookie — login page has no session, so skip sidebar
    const cookieStore = cookies();
    const session = cookieStore.get('admin_session');
    const isAuthenticated = session?.value === 'authenticated';

    // ── Login page (no session) — render bare, no sidebar ──
    if (!isAuthenticated) {
        return (
            <html lang="en">
                <body className={fira_sans.variable} style={{ margin: 0, padding: 0 }}>
                    {children}
                </body>
            </html>
        );
    }

    // ── Authenticated pages — render with sidebar ──
    let badges = { unread: 0, pending: 0 };
    try {
        await connectDB();
        const [unread, pending] = await Promise.all([
            mongoose.connection.collection('messages').countDocuments({ read: { $ne: true } }),
            mongoose.connection.collection('comments').countDocuments({ approved: false }),
        ]);
        badges = { unread, pending };
    } catch (_) {
        // Silently fail — badges just won't show counts
    }

    return (
        <html lang="en">
            <body className={fira_sans.variable} style={{ margin: 0, padding: 0 }}>
                <AdminLayout badges={badges}>
                    {children}
                </AdminLayout>
            </body>
        </html>
    );
}
