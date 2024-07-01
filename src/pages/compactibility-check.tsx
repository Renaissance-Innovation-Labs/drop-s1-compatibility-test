import img1 from "@/assets/images/Group.svg";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { checkRequest } from "../api";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function CompatibilityCheck() {
    const isInviter = JSON.parse(
        localStorage.getItem("isInviter") as string
    ) as boolean;

    const [questionerSummary, setQuestionerSummary] = useState(
        JSON.parse(localStorage.getItem("questionerSummary") as string)
    );

    const welcomeRequestMutation = useMutation({
        mutationFn: checkRequest,
        onSuccess: (data) => {
            setQuestionerSummary(data.questioner);
            console.log(data);
            localStorage.setItem(
                "questionerSummary",
                JSON.stringify(data.questioner)
            );
        },
        onError: (err) => {
            console.log(err);
            toast(`Something went wrong`, {
                description: "We're resolving the issue",
                closeButton: true,
                classNames: {
                    toast: "p-5 border pt-8",
                    title: "text-red-500 text-[16px] font-medium",
                    closeButton: "top-[5px] scale-[1.2] left-[20px] text-[25px] ",
                },
            });
        },
    });

    function checkCompatibility() {
        toast(`Checking compatibility`, {
            classNames: {
                toast: "p-5 border pt-6",
                title: "text-[16px] font-medium",
            },
        });

        welcomeRequestMutation.mutate({
            connectionId: localStorage.getItem("connectionId"),
        });
    }

    useEffect(() => {
         checkCompatibility();
    }, []);

    return (
        <div className="min-h-screen h-max flex justify-center items-center py-10 px-3">
            <div className=" max-w-[400px] ">
                <div className="text-center">
                    <h1 className="font-[900] text-[20px] mb-2">
                        {questionerSummary && <>{questionerSummary.summary[2]}</>}{" "}
                        Compatible
                    </h1>
                    {questionerSummary && (
                        <p className="text-neutral-600">
                            {questionerSummary.summary[isInviter ? 0 : 1]}
                        </p>
                    )}
                </div>

                <img className="object-contains mx-auto my-5" src={img1} alt="" />
                <div className=" my-20">
                    {questionerSummary && (
                        <div>
                            <h2 className="font-[600] ">Your answers</h2>
                            <Accordion type="single" collapsible className="w-full">
                                {questionerSummary.questions.map(
                                    ({
                                        question,
                                        choices,
                                        inviterAnswer,
                                        inviteeAnswer,
                                    }: Question) => (
                                        <AccordionItem
                                            className={
                                                "bg-neutral-100 border border-neutral-300 mb-2 px-2 rounded-[8px] "
                                            }
                                            value={question}
                                        >
                                            <AccordionTrigger
                                                className={"text-[15px] font-[600] text-left"}
                                            >
                                                {question}
                                            </AccordionTrigger>
                                            <AccordionContent className={" pl-[60px] "}>
                                                <ul className="gap-2 grid">
                                                    {choices.map(({ name }, index) => (
                                                        <li className="text-[13px]  relative border border-neutral-400 p-2 font-[500] rounded-[8px] flex items-center  ">
                                                            {name}
                                                            {inviterAnswer !== inviteeAnswer ? (
                                                                <>
                                                                    {inviterAnswer == index && (
                                                                        <>
                                                                            {isInviter ? (
                                                                                <div className="text-[11px] w-[60px] left-[-55px] rounded-[5px] rounded-r-[20px] bg-primary text-[white] p-2 leading-[12px] py-[4px] absolute">
                                                                                    your choice
                                                                                </div>
                                                                            ) : (
                                                                                <div className="text-[11px] w-[60px] left-[-55px] rounded-[5px] rounded-r-[20px] bg-[#142E35] text-[white] p-2 leading-[12px] py-[4px] absolute">
                                                                                    partner choice{" "}
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                    {inviteeAnswer == index && (
                                                                        <>
                                                                            {isInviter ? (
                                                                                <div className="text-[11px] w-[60px] left-[-55px] rounded-[5px] rounded-r-[20px] bg-[#142E35] text-[white] p-2 leading-[12px] py-[4px] absolute">
                                                                                    partner choice{" "}
                                                                                </div>
                                                                            ) : (
                                                                                <div className="text-[11px] w-[60px] left-[-55px] rounded-[5px] rounded-r-[20px] bg-primary text-[white] p-2 leading-[12px] py-[4px] absolute">
                                                                                    your choice
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {index === inviteeAnswer && (
                                                                        <div className="text-[11px] w-[60px] left-[-55px] rounded-[5px] rounded-r-[20px] bg-primary text-[white] p-2 leading-[12px] py-[4px] absolute">
                                                                            Both choose
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                )}
                                
                            </Accordion>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
