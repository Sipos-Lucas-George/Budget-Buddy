"use server";

import './NavBar.css';
import Image from "next/image"
import Link from "next/link";
import {auth} from "@/auth";
import ProfileMenu from "@/components/ProfileMenu";

export default async function Navbar() {
    const session = await auth();
    return (
        <div>
            <nav className="navbar w-full">
                <Link href="/">
                    <Image src="/assets/logo.png" alt={"Budget Buddy"} width={100} height={100} priority={true}/>
                </Link>
                <div className="links">
                    <ProfileMenu session={session}/>
                </div>
            </nav>
        </div>
    );
};