import { Mic } from "lucide-react";
import { Toggle } from "../ui/toggle";

export default function Recorder({handleRecordToggle, recording}){
    return (
        <Toggle pressed={recording} onPressedChange={handleRecordToggle}>
            <Mic className="inline-block size-5"/>
        </Toggle>
    )
}