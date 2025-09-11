export const metadata = {
  title: "AOCE POC",
  description: "4 tours AOCE, salle à code, Mongo TTL"
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="container">
          {children}
          <div className="footer">AOCE POC — minimal & éphémère</div>
        </div>
      </body>
    </html>
  );
}
