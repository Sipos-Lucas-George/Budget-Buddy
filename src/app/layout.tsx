import type {Metadata} from "next";
import "./globals.css";
import React from "react";
import Navbar from "@/components/nav_bar/NavBar";
import Provider from "@/components/Provider";
import {SettingsProvider} from "@/components/SettingsProvider";
import {AppRouterCacheProvider} from '@mui/material-nextjs/v13-appRouter';
import {ThemeProvider} from "@mui/material/styles";
import theme from "@/theme/theme";

export const metadata: Metadata = {
    title: "Budget Buddy",
    description: "Streamline your finances with Budget Buddy, your go-to app for effortless expense tracking and budgeting.",
    icons: [
        {rel: 'icon', url: '/icon.png'},
        {rel: 'apple', url: '/icon.png'},
    ],
};

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Provider>
            <html lang="en">
            <body className="h-screen flex flex-col">
            <AppRouterCacheProvider>
                <ThemeProvider theme={theme}>
                    <SettingsProvider>
                        <Navbar/>
                        {children}
                    </SettingsProvider>
                </ThemeProvider>
            </AppRouterCacheProvider>
            </body>
            </html>
        </Provider>
    );
}
