import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getTopicRequest } from "../api";
import { toast } from "sonner";
import { answerQuestion } from "../lib/socket";

const topics = [
    {
        topic: "Communication",
        number: 4,
    },
    {
        topic: "Values and Beliefs",
        number: 4,
    },
    {
        topic: "Financial Habits",
        number: 4,
    },
    {
        topic: "Life Goals",
        number: 4,
    },
    {
        topic: "Conflict Resolution",
        number: 4,
    },
];

function Selection({
    name,
    numberOfQuestion,
    onClick,
}: {
    onClick: () => void;
    name: string;
    numberOfQuestion: number;
}) {
    return (
        <>
            <div
                onClick={onClick}
                className="p-4 bg-[#28444B] rounded-[8px] flex items-center gap-3  "
            >
                <div className="relative w-[50px] h-[50px] bg-[white] rounded-[8px] "></div>
                <div>
                    <h3 className="font-[600]  ">{name}</h3>
                    <p className="text-[#72878C]  ">{numberOfQuestion} questions</p>
                </div>
            </div>
        </>
    );
}
function RandomAds({ title, subTitle }: { title: string; subTitle: string }) {
    return (
        <>
            <div className="p-3 bg-[#28444B] rounded-[8px] ">
                <h3 className="font-[600] text-[15px] ">{title}</h3>
                <p className="text-[#72878C] text-[12px] ">{subTitle}</p>
            </div>
        </>
    );
}

export default function QuestionSelection() {
    const navigate = useNavigate();

    const welcomeRequestMutation = useMutation({
        mutationFn: getTopicRequest,
        onSuccess: (data) => {
            console.log(data)
            localStorage.setItem("question", JSON.stringify(data.questions));
            localStorage.setItem("intro", data.intro);
            localStorage.setItem("topic", data.topic);
            answerQuestion(localStorage.getItem("connectionId") as string, {
                info: "q-sel",
            });
            navigate("/intro");
        },
        onError: () => {
            toast(`Something went wrong`, {
                description: "We're resolving the issue",
                closeButton: true,
                classNames: {
                    toast: "p-5 border pt-8",
                    title: "text-red-500 text-[16px] font-medium",
                    closeButton: "top-[5px] scale-[1.2] left-[15px] text-[25px] ",
                },
            });
        },
    });

    function onSelect(topic: string) {
        toast(`Setting up questions`, {
            description: "Question are been generate based on the selected topic",
            classNames: {
                toast: "p-5 border pt-6",
                title: "text-[16px] font-medium",
            },
        });

        welcomeRequestMutation.mutate({
            connectionId: localStorage.getItem("connectionId"),
            topic: topic,
        });
    }
 
    return (
        <div className="min-h-screen bg-[#142E35] h-max py-10 px-3 text-[white]  flex justify-center items-center">
            <div className="max-w-[400px]">
                <div>
                    <h2 className="font-[900] mb-2">
                        We have tailored the test into 5 sections
                    </h2>
                    <p>
                        An invite has been sent to your partner, you will be notified once
                        they accept the invite.{" "}
                    </p>
                </div>

                <div className="grid gap-3 my-10">
                    {topics.map(({ number, topic }) => (
                        <Selection
                            onClick={() => { onSelect(topic) }}
                            numberOfQuestion={number}
                            name={topic}
                        />
                    ))}
                </div>
                <div>
                    <h1>Random - Adds on</h1>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <RandomAds
                            subTitle="Talk about your interest"
                            title="Interest and Hobbies"
                        />
                        <RandomAds
                            subTitle="Talk about your emotions"
                            title="Emotional Connections"
                        />
                        <RandomAds
                            subTitle="Talk about your culture"
                            title="Cultural Backgrounds"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
