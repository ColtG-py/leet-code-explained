import Link from "next/link"
import { FaYoutube, FaTwitter, FaGithub, FaLaptop } from "react-icons/fa"
import { robotoMono } from "../fonts"

export default function Navbar() {
    return (
        <nav className="bg-slate-680 p-4 sticky top-0 drop-shadow-xl z-10">
            <div className="prose prose-xl mx-auto flex justify-between flex-col sm:flex-row">
                <h1 className={`${robotoMono.className} underlinetext-3xl font-extrabold grid place-content-center mb-2 md:mb-0 text-2xl font-bold grid place-content-center mb-2 md:mb-0`} >
                    <Link href="/" className="text-white-700 text-white/90 no-underline hover:text-white">
                        Software, explained.
                    </Link>
                </h1>
                <div className="flex flex-row justify-center sm:justify-evenly align-middle gap-4 text-white text-4xl lg:text-5xl">
                    <Link className="text-white/90 hover:text-white" href="https://github.com/ColtG-py/leet-code-explained">
                        <FaGithub />
                    </Link>
                </div>
            </div>
        </nav>
    )
}