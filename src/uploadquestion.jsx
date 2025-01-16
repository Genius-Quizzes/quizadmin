import React, { useState } from 'react';
import { db } from './firebase'; // Correct Firebase import
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'; // Firestore imports
import './uploadquestion.css';
import * as XLSX from 'xlsx'; // Importing xlsx

const UploadPage = () => {
  const [question, setQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [explanation, setExplanation] = useState('');
  const [courseAmount, setCourseAmount] = useState(0);
  const [paymentOption, setPaymentOption] = useState('Free');
  const [yearOfExam, setYearOfExam] = useState('');
  const [examName, setExamName] = useState('');
  const [xlsxFile, setXlsxFile] = useState(null); // state to hold the file

  // Handle individual form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const questionsRef = collection(db, 'courses');
      const courseAmountNumber = parseFloat(courseAmount);

      // Add question data to Firebase
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
        courseAmount: courseAmount.toString(),
        paymentOption,
        yearOfExam,
        examName,
      });

      const courseId = docRef.id;
      const courseRef = doc(db, 'courses', courseId);
      await updateDoc(courseRef, { courseId });

      alert('Question added successfully!');
      resetForm();
    } catch (err) {
      console.error('Error adding document: ', err.message);
      alert(`Failed to add question: ${err.message}`);
    }
  };

  // Function to reset the form fields
  const resetForm = () => {
    setQuestion('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer('A');
    setExplanation('');
    setCourseAmount(0);
    setPaymentOption('Free');
    setYearOfExam('');
    setExamName('');
  };

  // Handle XLSX file selection and parse it
  const handleXlsxFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      setXlsxFile(file);
      parseXlsxFile(file);
    } else {
      alert('Please upload a valid .xlsx file');
    }
  };

  // Parse XLSX file and upload questions to Firestore
  const parseXlsxFile = async (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];  // Get the first sheet name
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      console.log('Parsed XLSX data:', jsonData); // Log the parsed data for debugging

      // Upload each question from the parsed JSON data
      for (const questionData of jsonData) {
        await uploadQuestionFromXlsx(questionData);
      }

      alert('Questions uploaded successfully!');
    };
    reader.readAsArrayBuffer(file);
  };

  // Function to upload a question from the parsed xlsx data
  const uploadQuestionFromXlsx = async (questionData) => {
    try {
      // Ensure all required fields are present
      if (!questionData.question || !questionData.optionA || !questionData.optionB || !questionData.optionC || !questionData.optionD || !questionData.correctAnswer || !questionData.explanation) {
        console.error('Missing required data:', questionData);
        return; // Skip this entry if data is missing
      }

      const questionsRef = collection(db, 'courses');
      const courseAmountNumber = parseFloat(questionData.courseAmount) || 0;

      // Prepare the data to be uploaded
      const docRef = await addDoc(questionsRef, {
        question: questionData.question,
        options: {
          A: questionData.optionA,
          B: questionData.optionB,
          C: questionData.optionC,
          D: questionData.optionD,
        },
        correctAnswer: questionData.correctAnswer,
        explanation: questionData.explanation,
        courseAmount: courseAmountNumber.toString(),
        paymentOption: questionData.paymentOption || 'Free', // Default to 'Free' if not present
        yearOfExam: questionData.yearOfExam || '', // Handle missing year
        examName: questionData.examName || '', // Handle missing exam name
      });

      // After creating the document, update it with the courseId
      const courseId = docRef.id;
      const courseRef = doc(db, 'courses', courseId);
      await updateDoc(courseRef, { courseId });

      console.log(`Successfully uploaded question: ${questionData.question}`);
    } catch (err) {
      console.error('Error uploading question from XLSX:', err.message, err);
    }
  };

  return (
    <div className="upload-page">
      <h2 className="upload-page-title">Upload Page</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        {/* Course Amount */}
        <div className="form-group">
          <label className="form-label">Course Amount:</label>
          <input
            className="form-input"
            type="number"
            value={courseAmount}
            onChange={(e) => setCourseAmount(e.target.value)}
            required
          />
        </div>

        {/* Payment Option */}
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

        {/* Year of Exam */}
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

        {/* Exam Name */}
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

        {/* Question */}
        <div className="form-group">
          <label className="form-label">Question:</label>
          <textarea
            className="form-input question-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        {/* Options A, B, C, D */}
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

        {/* Correct Answer */}
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

        {/* Explanation */}
        <div className="form-group">
          <label className="form-label">Explanation:</label>
          <textarea
            className="form-input explanation-input"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            required
          />
        </div>

        {/* XLSX File Upload */}
        <div className="form-group">
          <label className="form-label">Choose XLSX File:</label>
          <input
            type="file"
            className="form-input"
            onChange={handleXlsxFileChange} // Handle file change
          />
        </div>

        {/* Submit Button for Manual Form */}
        <button className="submit-button" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UploadPage;
