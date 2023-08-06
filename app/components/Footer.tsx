import Link from "next/link"
import { FaYoutube, FaTwitter, FaGithub, FaLaptop } from "react-icons/fa"
import { robotoMono } from "../fonts"
import Subscribe from "./Subscribe"

export default function Footer() {
    return (
        <footer>
            <nav className="bg-slate-680">
                <div className="prose prose-xl mx-auto flex justify-between flex-col sm:flex-row">
                    <h1 className={`${robotoMono.className} underlinetext-3xl font-extrabold grid place-content-center mb-2 md:mb-0 text-2xl font-bold grid place-content-center mb-2 md:mb-0`} >
                        <Link href="/" className="text-white-700 text-white/90 no-underline hover:text-white">
                            Software, explained.
                        </Link>
                    </h1>
                    <div className="flex flex-row justify-center sm:justify-evenly align-middle gap-4 text-white text-4xl lg:text-5xl">
                        <Subscribe />
                    </div>
                </div>
            </nav>
        </footer>
    )
}