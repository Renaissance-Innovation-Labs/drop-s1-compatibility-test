import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function Done() {
    return (
        <>
            <div className="h-screen py-10 flex justify-center items-center px-3">
                <div className="text-center max-w-[400px] ">
                    <h1 className="font-[900] text-[20px] mb-2">Communication</h1>
                    <p className="text-neutral-600">Curious to know how compatible you are with communication? </p>
                    <div className="flex justify-between items-center max-w-[90%] my-20">
                        <div>
                            <h1 className="font-[800] text-[25px] ">You</h1>
                            <p>Completed</p>
                        </div>
                        <div>
                            <h1 className="font-[800] text-[25px] ">You</h1>
                            <p>Partner</p>
                        </div>
                    </div>
                    <Link to={"/check"} className="relative mt-10">
                        <Button className="w-full">Check Compatibility</Button>
                    </Link>
                </div>
            </div>
        </>
    )
}
