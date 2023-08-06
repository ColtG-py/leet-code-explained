import Link from "next/link"
import { robotoMono } from "../fonts"
import Subscribe from "./Subscribe"
import { FaCoffee } from "react-icons/fa"

export default function Footer() {
    return (
        <footer className="mt-2">
            <nav className="bg-slate-800">
                <div className="prose prose-xl mx-auto flex justify-between flex-col sm:flex-row">
                    <div className="flex flex-row justify-center sm:justify-evenly align-middle gap-4 text-white lg:text-5xl">
                        <Subscribe />
                    </div>
                    <Link className="text-white/90 hover:text-white" href="https://ko-fi.com/coltgainey">     
                        <FaCoffee />
                    </Link>
                </div>
                
            </nav>
        </footer>
    )
}