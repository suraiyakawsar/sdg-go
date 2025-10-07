import { useEffect, useState } from 'react';
import { on, off, emit } from '../../utils/eventBus';

export default function DialogueBox() {
  const [visible, setVisible] = useState(false);
  const [currentLine, setCurrentLine] = useState(null);
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    // Listen for when Phaser emits a new dialogue
    const showHandler = (data) => {
      setCurrentLine(data.text);
      setChoices(data.choices || []);
      setVisible(true);
    };

    const hideHandler = () => {
      setVisible(false);
      setCurrentLine(null);
      setChoices([]);
    };

    on('showDialogue', showHandler);
    on('hideDialogue', hideHandler);

    // Cleanup listeners on unmount
    return () => {
      off('showDialogue', showHandler);
      off('hideDialogue', hideHandler);
    };
  }, []);

  const handleNext = () => {
    emit('dialogueNext');
  };

  const handleChoice = (choice) => {
    emit('dialogueChoice', choice);
    setChoices([]);
  };

  if (!visible) return null;

  return (
    <div className="w-full bg-black/80 text-white p-6 rounded-t-2xl shadow-lg">
      <div className="max-w-3xl mx-auto text-center">
        {/* Dialogue text */}
        <p className="text-lg mb-4 leading-relaxed">{currentLine}</p>

        {/* Choices (if any) */}
        {choices.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-3">
            {choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoice(choice)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all pointer-events-auto"
              >
                {choice.text}
              </button>
            ))}
          </div>
        ) : (
          // "Next" button if no choices available
          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl transition-all pointer-events-auto"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
