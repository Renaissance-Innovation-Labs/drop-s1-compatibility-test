import img1 from "@/assets/images/connecting-wnDq5KJlci.svg"
import { answerQuestion } from "../lib/socket"

export default function DoneWaiting() {

    function sendNudge() {
        answerQuestion(localStorage.getItem("connectionId") as string, {
            title: "Waiting",
            message: "your partner is done and waiting for you"
        })
    }

    return (
        <div className="h-screen flex justify-center items-center py-10">
            <div className="text-center max-w-[400px] ">
                <h1 className="font-[900] text-[25px]" >Great job!</h1>
                <p className="text-neutral-600">One more step</p>
                <div className="my-10 mt-14">
                    <img className="mx-auto object-contains" src={img1} alt="my gee" />
                    <p className="max-w-[250px] mt-5 mx-auto font-[500]">Waiting for your partner to complete the questionnaire</p>
                </div>

                <div>
                    <p onClick={sendNudge} className="font-[500] underline">Send a nudge</p>
                </div>
            </div>
        </div>
    )
}
