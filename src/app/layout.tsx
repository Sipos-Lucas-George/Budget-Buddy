import type {Metadata} from "next";
import "./globals.css";
import React from "react";
import Navbar from "@/components/nav_bar/NavBar";
import Provider from "@/components/Provider";

export const metadata: Metadata = {
    title: "Budget Buddy",
    description: "Streamline your finances with Budget Buddy, your go-to app for effortless expense tracking and budgeting.",
    icons: [
        { rel: 'icon', url: '/icon.png' },
        { rel: 'apple', url: '/icon.png' },
    ],
};

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <Provider>
            <html lang="en">
            <body className="h-screen flex flex-col">
            <Navbar/>
            {children}
            </body>
            </html>
        </Provider>
    );
}
