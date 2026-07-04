import padsData from "./pads"
import { useState } from "react"
import Pad from "../components/Pad"
import { useRef } from "react"

export default function App() {
    const [pads, setPads] = useState(padsData)
    const buttonElements = pads.map(pad => 
        <Pad key = {pad.id} id = {pad.id} color = {pad.color} on = {pad.on} toggle = {toggle} />
    )

    function toggle(id) {
        console.log("clicked! ");
        setPads(prevPads => prevPads.map( pad => {
            return pad.id == id ? {...pad, on: !pad.on} :pad
        }))
    }

    return (
        <main>
            <div className="pad-container">
                {buttonElements}
            </div>
        </main>
    )
}