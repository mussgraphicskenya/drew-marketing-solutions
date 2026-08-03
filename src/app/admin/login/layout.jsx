/**
 * This file is intentionally minimal.
 * The login page exclusion from AdminLayout is handled
 * in the parent src/app/admin/layout.jsx by checking
 * the admin_session cookie — no sidebar is rendered
 * when the user is not authenticated.
 *
 * A nested layout CANNOT provide its own <html>/<body>
 * in Next.js 14 App Router — that only works for root layouts.
 */
export default function LoginLayout({ children }) {
    return <>{children}</>;
}
