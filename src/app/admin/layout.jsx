import { Fira_Sans } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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

export default function AdminLayout({ children }) {
    return (
        <html lang="en">
            <body className={fira_sans.variable} style={{ margin: 0, padding: 0 }}>
                {children}
            </body>
        </html>
    );
}
