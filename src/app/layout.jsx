/*
 * Supplies AILOUVRE's required document shell and page metadata.
 * Gallery rendering and data access belong to future page implementations.
 */
import "./globals.css";

export const metadata = {
  title: "AILOUVRE",
  description: "A daily gallery of AI-generated art.",
};

/**
 * @param {{ children: import("react").ReactNode }} props
 * @returns {import("react").ReactElement}
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
