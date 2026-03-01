import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Send } from 'lucide-react';

function ChatAi({problem}) {

    const [isLoading, setIsLoading] = useState(false);

    const [messages, setMessages] = useState([
        { role: 'model', parts:[{text: "Hi, How are you"}]},
        { role: 'user', parts:[{text: "I am Good"}]}
    ]);

    const { register, handleSubmit, reset,formState: {errors} } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const onSubmit = async (data) => {
        const userMessage = {role: 'user', parts:[{text: data.message}]};
        const updatedMessage = [...messages, userMessage];

        setMessages(updatedMessage);
        reset();
        setIsLoading(true);

        try {
            
            const response = await fetch("/ai/chat", {
                method: "POST",
                credentials: "include",
                headers: {
                   "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages:updatedMessage,
                    title:problem.title,
                    description:problem.description,
                    testCases: problem.visibleTestCases,
                    startCode:problem.startCode
                })
            });

            if(!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            let aiMessage = {role: "model", parts:[{text: ""}]};
            
            // adding an empty message at start 
            setMessages(prev => [...prev, aiMessage]);
            
            const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            while(true){
                const { done, value } = await reader.read();
                if(done) break;
                
                const chunk = decoder.decode(value);
                aiMessage.parts[0].text += chunk;
                // updating live message
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {...aiMessage};
                    return updated;
                });

                await sleep(200);
            }

        } catch (error) {
            console.error("Streaming error:", error);
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: "Error from AI Chatbot"}]
            }]);
        }  finally{
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                    >
                        <div className="chat-bubble bg-base-200 text-base-content">
                            {msg.parts[0].text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="sticky bottom-0 p-4 bg-base-100 border-t"
            >
                <div className="flex items-center">
                    <input 
                        placeholder="Ask me anything" 
                        className="input input-bordered flex-1" 
                        {...register("message", { required: true, minLength: 2 })}
                    />
                    <button 
                        type="submit" 
                        className="btn btn-ghost ml-2"
                        disabled={errors.message || isLoading}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatAi;