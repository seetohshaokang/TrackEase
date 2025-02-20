
import "./globals.css";

export const metadata = {
  title: "TrackEase",
  description: "Generated by Next.js",
  icons: {
    icon: ['/favicon2.png?v=4',], 
    apple: ['/apple-touch-icon.png?v=4',],
    shortcut: ['/apple-touch-icon.png']
  },
  manifest: '/site.webmanifest'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex bg-white">
        <main className="flex-grow ">{children}</main>
      </body>
    </html>
  );
}
