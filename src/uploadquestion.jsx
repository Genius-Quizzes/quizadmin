import React, { useState } from 'react';
import { db } from './firebase'; // Correct Firebase import
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'; // Firestore imports
import './uploadquestion.css';

const UploadPage = () => {
  const [question, setQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('A'); // Default to 'A'
  const [explanation, setExplanation] = useState('');
  const [courseAmount, setCourseAmount] = useState(0); // New state for course amount
  const [paymentOption, setPaymentOption] = useState('Free'); // Payment option (Free or Paid)
  const [title, setTitle] = useState(''); // New state for title
  const [yearOfExam, setYearOfExam] = useState(''); // New state for year of exam
  const [examName, setExamName] = useState(''); // New state for exam name

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const questionsRef = collection(db, 'courses');

      // Ensure courseAmount is stored as a number (parseFloat or parseInt depending on the expected format)
      const courseAmountNumber = parseFloat(courseAmount);

      // Add the question to Firebase
      const docRef = await addDoc(questionsRef, {
        question,
        options: {
          A: optionA,
          B: optionB,
          C: optionC,
          D: optionD,
        },
        correctAnswer,
        explanation,
        courseAmount: courseAmount.toString(),  // Store as a number
        paymentOption,
        title,
        yearOfExam,
        examName,
      });

      // Get the auto-generated courseId (document ID)
      const courseId = docRef.id;

      // Update the document with the generated courseId using updateDoc
      const courseRef = doc(db, 'courses', courseId);
      await updateDoc(courseRef, {
        courseId,
      });

      alert('Question added successfully!');

      // Reset form fields
      setQuestion('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setCorrectAnswer('A');
      setExplanation('');
      setCourseAmount(0);
      setPaymentOption('Free');
      setTitle('');
      setYearOfExam('');
      setExamName('');
    } catch (err) {
      console.error('Error adding document: ', err.message);
      alert(`Failed to add question: ${err.message}`);
    }
  };

  return (
    <div className="upload-page">
      <h2 className="upload-page-title">Upload Page</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Course Amount:</label>
          <input
            className="form-input"
            type="number"
            value={courseAmount}
            onChange={(e) => setCourseAmount(e.target.value)} // Ensure value is being captured as a number
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Payment Option:</label>
          <select
            className="form-input"
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value)}
            required
          >
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Title:</label>
          <input
            className="form-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Year of Exam:</label>
          <input
            className="form-input"
            type="text"
            value={yearOfExam}
            onChange={(e) => setYearOfExam(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Exam Name:</label>
          <input
            className="form-input"
            type="text"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Question:</label>
          <textarea
            className="form-input question-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div className="options-grid">
          <div className="form-group">
            <label className="form-label">A:</label>
            <input
              className="form-input option-input"
              type="text"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">B:</label>
            <input
              className="form-input option-input"
              type="text"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">C:</label>
            <input
              className="form-input option-input"
              type="text"
              value={optionC}
              onChange={(e) => setOptionC(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">D:</label>
            <input
              className="form-input option-input"
              type="text"
              value={optionD}
              onChange={(e) => setOptionD(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Correct Answer:</label>
          <select
            className="form-input correct-answer-input"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Explanation:</label>
          <textarea
            className="form-input explanation-input"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            required
          />
        </div>

        <button className="submit-button" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UploadPage;
