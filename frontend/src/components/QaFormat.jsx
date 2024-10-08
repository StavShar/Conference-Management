import { useState, useEffect } from 'react';
import './pages/styles/QaFormat.css'

function QaFormat({data}) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    answers: ['', '']
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isNewQuestion, setIsNewQuestion] = useState(false);
  const [editedQuestionIndex, setEditedQuestionIndex] = useState(null);
  const [addQuestion , setAddQuestion]=useState(true)

  useEffect(() => {
    data(questions);
    console.log(questions);
  }, [questions]);
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...currentQuestion.answers];
    newAnswers[index] = value;
    setCurrentQuestion({ ...currentQuestion, answers: newAnswers });
  };

  const handleAddAnswer = () => {
    if (!isEditMode && currentQuestion.answers.length < 5) {
      setCurrentQuestion({ ...currentQuestion, answers: [...currentQuestion.answers, ''] });
    } else if (isEditMode && currentQuestion.answers.length < 4) {
      const newQuestions = [...questions];
      newQuestions[editedQuestionIndex].answers.push('');
      setQuestions(newQuestions);
    }
  };

  const handleDeleteAnswer = (qIndex, aIndex) => {
    if (isEditMode) {
      const newQuestions = [...questions];
      const updatedQuestion = { ...newQuestions[qIndex] };
      const newAnswers = [...updatedQuestion.answers];
      newAnswers.splice(aIndex, 1);
      updatedQuestion.answers = newAnswers;
      newQuestions[qIndex] = updatedQuestion;
      setQuestions(newQuestions);
    } else if (currentQuestionIndex === qIndex || currentQuestionIndex + 1 === qIndex) {
      const newAnswers = [...currentQuestion.answers];
      newAnswers.splice(aIndex, 1);
      setCurrentQuestion({ ...currentQuestion, answers: newAnswers });
    }
  };

  const handleAddQuestion = () => {
    console.log(currentQuestion.answers.every((answer => answer.trim())));
    if(currentQuestion.question.trim() === '')
    {
      alert('Please fill the question');
    }
    if(currentQuestion.answers.every(answer => answer === ""))
    {
      
      alert('Please fill all the answers');
    }
    if (!isEditMode && currentQuestion.question.trim() !== '' && currentQuestion.answers.every(answer => answer.trim() !== '')) {
      const updatedQuestions = [...questions, currentQuestion];
      setQuestions(updatedQuestions);
      setCurrentQuestion({ question: '', answers: ['', ''] });
      setAddQuestion(false)
    }
  };

  const handleAddNewQuestion = () => {
    setAddQuestion(true);
  };

  const handleDeleteQuestion = (index) => {
    if (!isEditMode) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };

  const handleEditQuestion = (index) => {
    setEditedQuestionIndex(index);
    setCurrentQuestionIndex(index);
    setCurrentQuestion(questions[index]);
    setIsEditMode(true);
  };

  const handleDoneEditing = () => {
    setIsEditMode(false);
    setCurrentQuestion({ question: '', answers: ['', ''] });
    setEditedQuestionIndex(null);
  };

  useEffect(() => {
    if (!isNewQuestion) {
      setCurrentQuestionIndex(questions.length > 0 ? questions.length - 1 : 0);
    }
    setIsNewQuestion(false);
  }, [questions, isNewQuestion]);

  return (
    <div className="question-input-container">
      {questions.map((q, index) => (
        <div key={index} className={index === currentQuestionIndex ? 'question active' : 'question'}>
          <h3>Question {index + 1}</h3>
          <label>
            Question:
            <input
              type="text"
              value={editedQuestionIndex === index ? currentQuestion.question : q.question}
              onChange={(event) => {
                const updatedQuestions = [...questions];
                updatedQuestions[index].question = event.target.value;
                setQuestions(updatedQuestions);
              }}
              disabled={!isEditMode || editedQuestionIndex !== index}
            />
          </label>
          <ul>
            {q.answers.map((answer, aIndex) => (
              <li key={aIndex}>
                <label>
                  Answer {aIndex + 1}:
                  <input
                    type="text"
                    value={editedQuestionIndex === index ? currentQuestion.answers[aIndex] : answer}
                    onChange={(event) => {
                      const updatedQuestions = [...questions];
                      updatedQuestions[index].answers[aIndex] = event.target.value;
                      setQuestions(updatedQuestions);
                    }}
                    disabled={!isEditMode || editedQuestionIndex !== index}
                  />
                  {(editedQuestionIndex === index || isNewQuestion) && q.answers.length > 2 && (
                    <button type="button" class="qa-form-button delete-btn" onClick={() => handleDeleteAnswer(index, aIndex)}>Delete Answer</button>
                  )}
                </label>
              </li>
            ))}
          </ul>
          {!isEditMode && (
            <button className="qa-form-button" onClick={() => handleEditQuestion(index)}>Edit</button>
          )}
          {!isEditMode && (
            <button className="qa-form-button" onClick={() => handleDeleteQuestion(index)}>Delete</button>
          )}
        </div>
      ))}
      {!isNewQuestion && addQuestion && (
        <form>
         <label htmlFor="question" className="question">
            Enter your question:
            <input
            className='text'
              type="text"
              id='question'
              value={currentQuestion.question}
              onChange={(event) => setCurrentQuestion({ ...currentQuestion, question: event.target.value })}
              disabled={isEditMode}
            />
          </label>
          {currentQuestion.answers.map((answer, index) => (
            <div key={index} className="answer-input">
              <label>
                Answer {index + 1}:
                <input
                 className='text'
                  id={`answer-${index}`}
                  type="text"
                  value={answer}
                  onChange={(event) => handleAnswerChange(index, event.target.value)}
                  disabled={isEditMode}
                />
                {currentQuestion.answers.length > 2 && (
                  <button type="button" className="qa-form-button" onClick={() => handleDeleteAnswer(questions.length, index)}>Delete Answer</button>
                )}
              </label>
            </div>
          ))}
          {!isEditMode && currentQuestion.answers.length < 5 && (
            <button type="button"  className="qa-form-button" onClick={handleAddAnswer}>Add Another Answer</button>
          )}
          {!isEditMode && addQuestion &&(
            <button type="button" class="qa-form-button add-btn" onClick={handleAddQuestion}>Add Question</button>
          )}
        </form>
      )}
      {isNewQuestion && (
        <form>
           <label htmlFor="question" className="question">
            Enter your question:
            <input 
            className='text'
             id='question'
              type="text"
              value={currentQuestion.question}
              onChange={(event) => setCurrentQuestion({ ...currentQuestion, question: event.target.value })}
              disabled={isEditMode}
            />
          </label>
          {currentQuestion.answers.map((answer, index) => (
            <div key={index} className="answer-input">
              <label>
                Answer {index + 1} :
                <input
                className='answer'
                id={`answer-${index}`}
                  type="text"
                  value={answer}
                  onChange={(event) => handleAnswerChange(index, event.target.value)}
                  disabled={isEditMode}
                />
                {currentQuestion.answers.length > 2 && (
                  <button type="button" className="qa-form-button" onClick={() => handleDeleteAnswer(questions.length, index)}>Delete Answer</button>
                )}
              </label>
            </div>
          ))}
          {!isEditMode && currentQuestion.answers.length < 4 && (
            <button type="button" className="qa-form-button" onClick={handleAddAnswer}>Add Another Answer</button>
          )}
          {!isEditMode && (
            <button type="button" className="qa-form-button"  onClick={handleAddQuestion}>Add Question</button>
          )}
        </form>
      )}
      {isEditMode && editedQuestionIndex !== null && (
        <div>
          <button type="button" className="qa-form-button" onClick={handleAddAnswer}>Add Another Answer</button>
          <button type="button" className="qa-form-button"  onClick={handleDoneEditing}>Done</button>
        </div>
      )}
      {!addQuestion && questions.length < 3 && (
      <button type="button" className="qa-form-button" onClick={handleAddNewQuestion}>Add New Question</button>
      )}
    </div>
  );
}

export default QaFormat;
