import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { answerQuestion, joinQuestionerRoom } from "../lib/socket";

export default function Invitation() {
    const location = useLocation();
    const navigate = useNavigate();

    const [queryParams, setQueryParams] = useState(
        {} as {
            name: string | null;
            inviter: string | null;
            connectionId: string | null;
        }
    );

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (!params.get("connectionId") && !params.get("name") && !params.get("inviter")) {
            navigate("/")
        }

        const extractedParams = {
            connectionId: params.get("connectionId"),
            name: params.get("name"),
            inviter: params.get("inviter"),
        };

        setQueryParams(extractedParams);

    }, [location.search]);

    function accept() {
        if (queryParams.connectionId) {
            joinQuestionerRoom(queryParams?.connectionId as string)
            answerQuestion(queryParams?.connectionId as string, {
                hasAccepted: true,
            })
            console.log(queryParams?.connectionId)
            localStorage.setItem("connectionId", queryParams.connectionId)
        }
    }
    return (
        <div className="h-screen flex justify-center items-center py-10 px-3">
            <div className="text-center max-w-[400px] ">
                <h1 className="font-[900] text-[25px] mb-2">Invitation</h1>
                <p className="text-neutral-600">
                    Here you're going to take a compatibility test with{" "}
                    <span className="font-[800] text-red-500 text-[22px] ">
                        {queryParams?.inviter}
                    </span>{" "}
                </p>
                <Button onClick={accept} className="w-full mt-10">
                    Accept and take test
                </Button>
            </div>
        </div>
    );
}
