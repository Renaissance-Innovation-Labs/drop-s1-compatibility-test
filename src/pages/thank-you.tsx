import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function ThankYou() {

    return (
        <div className="h-screen flex justify-center items-center py-10">
            <div className="text-center max-w-[400px] ">
                <h1 className="font-[900] text-[25px] mb-2" >Thank you</h1>
                <p className="text-neutral-600">An invite has been sent to your partner, you will be notified once they accept the invite. </p>
                <Link to={"/selection"}>
                    <Button className="w-full mt-10">Get started</Button>
                </Link>
            </div>
        </div>
    )
}
