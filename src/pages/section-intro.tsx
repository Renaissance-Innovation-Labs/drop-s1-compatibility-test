import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import img1 from "@/assets/images/Frame 29.svg"
import { useEffect } from "react";

export default function SectionIntro() {
    const navigate = useNavigate();
    const topic = localStorage.getItem("topic")
    const intro = localStorage.getItem("intro")

    useEffect(() => {
        if (!topic || !intro) {
            navigate("/")
        }
    }, [topic, intro, navigate])

    return (
        <div className="h-screen flex justify-center items-center py-10">
            <div className="text-center max-w-[400px] ">
                <p className="bg-red-50 text-red-500 px-8 px-3 mb-5 rounded-[50px] w-max mx-auto text-[15px] ">Section 1</p>
                <h1 className="font-[900] text-[25px] mb-2" >{topic}</h1>
                <p className="text-neutral-600">{intro}</p>
                <img className="object-contains mx-auto my-5" src={img1} alt="" />
                <p className="font-[600] ">Relax, take a deep breathe...</p>
                <Link className="mt-10 flex" to={"/questioner"}>
                    <Button className="w-full">Let’s Begin</Button>
                </Link>
            </div>
        </div>
    )
}
