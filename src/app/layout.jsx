/*
 * Supplies AILOUVRE's required document shell and page metadata.
 * Gallery rendering and data access belong to future page implementations.
 */
import "../styles/globals.css";

export const metadata = {
  title: "AILOUVRE",
  description: "A daily gallery of AI-generated art.",
};

/**
 * Wraps the gallery routes in the shared document and local global styles.
 * @param {{ children: import("react").ReactNode }} props The active route content.
 * @returns {import("react").ReactElement} The root HTML document.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
