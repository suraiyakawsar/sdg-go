import { useEffect, useState } from "react";
import { on, off, emit } from "../../utils/eventBus";
import { motion, AnimatePresence } from "framer-motion";

export default function DialogueBox() {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ text: "", character: "", avatar: "", choices: [] });

  useEffect(() => {
    const showHandler = (dialogue) => {
      setData({
        text: dialogue.text,
        character: dialogue.character || "",
        avatar: dialogue.avatar || "",
        choices: dialogue.choices || [],
      });
      setVisible(true);
    };

    const hideHandler = () => {
      setVisible(false);
      setData({ text: "", character: "", avatar: "", choices: [] });
    };

    on("showDialogue", showHandler);
    on("hideDialogue", hideHandler);

    return () => {
      off("showDialogue", showHandler);
      off("hideDialogue", hideHandler);
    };
  }, []);

  const handleNext = () => emit("dialogueNext");
  const handleChoice = (choice) => emit("dialogueChoice", choice);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="dialogue"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[70%] lg:w-[60%] pointer-events-none"
        >
          <div className="pointer-events-auto bg-black/70 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8 text-white relative overflow-hidden">
            {/* Character avatar */}
            {data.avatar && (
              <img
                src={data.avatar}
                alt={data.character}
                className="absolute -top-10 left-6 w-24 h-24 rounded-full border-4 border-purple-400 object-cover shadow-md"
              />
            )}

            {/* Character name */}
            {data.character && (
              <div className="mb-4 pl-32">
                <h2 className="text-2xl font-bold text-purple-300 drop-shadow-sm">
                  {data.character}
                </h2>
              </div>
            )}

            {/* Dialogue text */}
            <p className="text-lg md:text-xl leading-relaxed mb-6 text-center px-4">
              {data.text}
            </p>

            {/* Choices or Next */}
            {data.choices.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-3">
                {data.choices.map((choice, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChoice(choice)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-medium px-5 py-2 rounded-xl shadow-md transition-all"
                  >
                    {choice.text}
                  </motion.button>
                ))}
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-medium px-6 py-2 rounded-xl shadow-md transition-all"
              >
                Continue
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
