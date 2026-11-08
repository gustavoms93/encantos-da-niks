import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
 title: "Encantos da Niks | Seu universo, seu encanto",
 description: "Acessórios alternativos, moda e presentes geek. Explore os produtos da Encantos da Niks, monte sua sacola e prepare seu pedido.",
 icons: { icon: "/favicon.svg" },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
 return <html lang="pt-BR"><body>{children}</body></html>;
}
