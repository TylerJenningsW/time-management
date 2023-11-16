import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { api } from "~/utils/api";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

function AiButton() {
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const { toast } = useToast();
  const {
    isOpen: isAIOpen,
    onOpen: onAIOpen,
    onClose: onAIClose,
  } = useDisclosure();

  const chatMutation = api.ai.chat.useMutation({
    onSuccess: (data) => {
      setAiResponse(data.text || "Error fetching chat message.");
    },
    onError: (error) => {
      console.error("Error getting AI response:", error);
      setAiResponse("Failed to get response from AI.");
    },
  });
  const queryCredits = api.user.getCredits.useQuery();
  const credits = queryCredits.data;
  const handleModalOpen = () => {
    if (Number(credits) > 99) {
      onAIOpen();
    } else {
      toast({
        className: cn(
          "bottom-2 rounded z-[2147483647] w-[400px] max-h-[100px] right-0 flex fixed md:max-w-[420px] md:bottom-2 md:right-4 sm:bottom-2 sm:right-0"
        ),
        description: `You do not have enough credits.`,
      });
    }
  };
  const handleOnClick = () => {
    if (Number(credits) > 99) {
      chatMutation.mutate({ text: prompt });
    } else {
      toast({
        className: cn(
          "bottom-2 rounded z-[2147483647] w-[400px] max-h-[100px] right-0 flex fixed md:max-w-[420px] md:bottom-2 md:right-4 sm:bottom-2 sm:right-0"
        ),
        description: `You do not have enough credits.`,
      });
    }
  };
  return (
    <>
      <button
        onClick={handleModalOpen}
        className="absolute left-[-56px] top-1/2 z-10 -translate-y-1/2 -rotate-90 transform rounded bg-blue-500 px-8 py-4 text-2xl text-white hover:bg-blue-300"
      >
        AI Chatbot
      </button>
      <Modal className=" h-[400px] max-h-[400px]" isOpen={isAIOpen} onClose={onAIClose} placement="top-center">
        <ModalContent>
          <ModalHeader>Chat with AI</ModalHeader>
          <ModalBody className="break-words max-h-1/4 overflow-x-hidden overflow-y-scroll">
            {aiResponse && <p>{aiResponse}</p>}
            {chatMutation.isLoading && (
              <p>
                Loading... <Spinner />
              </p>
            )}

          </ModalBody>
          <ModalFooter className="flex flex-col">
          <Input
              fullWidth
              label="Ask the AI"
              placeholder="Type your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="ml-auto">

            <Button color="danger" variant="flat" onPress={onAIClose}>
              Close
            </Button>
            <Button className="ml-2" isDisabled={chatMutation.isLoading} onClick={handleOnClick}>Submit</Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AiButton;
