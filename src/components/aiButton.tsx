import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { api } from "~/utils/api";
import { useState } from "react";

function AiButton() {
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");

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

  const handleOnClick = () => {
    chatMutation.mutate({ text: prompt });
    
  };
  return (
    <>
      <button
        onClick={onAIOpen}
        className="absolute left-[-36px] top-1/2 z-10 -translate-y-1/2 -rotate-90 transform rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-300"
      >
        AI Chatbot
      </button>
      <Modal isOpen={isAIOpen} onClose={onAIClose} placement="top-center">
        <ModalContent>
          <ModalHeader>Chat with AI</ModalHeader>
          <ModalBody>
            <Input
              fullWidth
              label="Ask the AI"
              placeholder="Type your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            {aiResponse && <p>{aiResponse}</p>}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onAIClose}>
              Close
            </Button>
            <Button onClick={handleOnClick}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AiButton;
