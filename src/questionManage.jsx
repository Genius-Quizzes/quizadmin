import React, { useEffect, useState } from 'react';
import './questionmanage.css'; // Link to the CSS file
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase'; // Importing db from firebase.jsx

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]); // All questions from the Firestore
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [filteredQuestions, setFilteredQuestions] = useState([]); // State for filtered questions
  const [editingQuestion, setEditingQuestion] = useState(null); // State for editing question
  const [editedData, setEditedData] = useState({
    question: '',
    options: { A: '', B: '', C: '', D: '' },
    correctAnswer: '',
    explanation: '',
    courseAmount: '',
    courseId: '',
    examName: '',
    paymentOption: '',
    title: '',
    yearOfExam: ''
  }); // State for edited data

  // Function to load questions by exam
  const loadExam = (exam) => {
    console.log(`Filtering questions for ${exam}...`);
    // Filter questions based on selected exam type
    const filtered = questions.filter((question) =>
      question.examName.toLowerCase().includes(exam.toLowerCase())
    );
    setFilteredQuestions(filtered); // Set the filtered questions for the selected exam
  };

  // Fetch questions from Firestore
  const fetchQuestions = async () => {
    const querySnapshot = await getDocs(collection(db, 'courses'));
    const questionsData = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      questionsData.push({
        id: doc.id,
        question: data.question,
        options: data.options,
        correctAnswer: data.correctAnswer,
        courseAmount: data.courseAmount,
        courseId: data.courseId,
        examName: data.examName,
        explanation: data.explanation,
        paymentOption: data.paymentOption,
        title: data.title,
        yearOfExam: data.yearOfExam,
      });
    });

    setQuestions(questionsData);
    setFilteredQuestions(questionsData); // Initially, all questions are shown
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // Update search term as user types
  };

  // Filter questions based on search term (e.g., in question, exam name, or title)
  useEffect(() => {
    const searchLower = searchTerm.toLowerCase();
    const filtered = questions.filter((question) => {
      return (
        question.question.toLowerCase().includes(searchLower) ||
        question.examName.toLowerCase().includes(searchLower) ||
        question.title.toLowerCase().includes(searchLower)
      );
    });
    setFilteredQuestions(filtered); // Update filtered questions state
  }, [searchTerm, questions]); // Trigger when searchTerm or questions change

  // Set the question for editing
  const handleEdit = (question) => {
    setEditingQuestion(question.id);
    setEditedData({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      courseAmount: question.courseAmount,
      courseId: question.courseId,
      examName: question.examName,
      paymentOption: question.paymentOption,
      title: question.title,
      yearOfExam: question.yearOfExam
    });
  };

  // Handle changes in the edit form
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith('options.')) {
      const optionKey = name.split('.')[1];
      setEditedData((prevData) => ({
        ...prevData,
        options: {
          ...prevData.options,
          [optionKey]: value
        }
      }));
    } else {
      setEditedData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  // Handle update of the question in Firestore
  const handleSaveEdit = async () => {
    const questionRef = doc(db, 'courses', editingQuestion);
    await updateDoc(questionRef, {
      question: editedData.question,
      options: editedData.options,
      correctAnswer: editedData.correctAnswer,
      explanation: editedData.explanation,
      courseAmount: editedData.courseAmount,
      courseId: editedData.courseId,
      examName: editedData.examName,
      paymentOption: editedData.paymentOption,
      title: editedData.title,
      yearOfExam: editedData.yearOfExam,
    });

    // After saving, reset editing state
    setEditingQuestion(null);
    fetchQuestions(); // Re-fetch questions to reflect the changes
  };

  // Handle deleting a question
  const handleDelete = async (id) => {
    const questionRef = doc(db, 'courses', id);
    await deleteDoc(questionRef);
    fetchQuestions(); // Re-fetch the data after deletion
  };

  return (
    <div className="question-management-container">
      <h2 className="section-title">Question Management</h2>


      {/* Exam Filter Buttons */}
      <div className="exams-button-group">
        {['UPSC', 'SSC', 'Bank Exams', 'GATE', 'NEET', 'JEE', 'CAT', 'RRB'].map((exam) => (
          <button
            key={exam}
            className="exams-button"
            onClick={() => loadExam(exam)} // Filter questions for selected exam
          >
            {exam}
          </button>
        ))}
      </div>

      {/* Edit Form */}
      {editingQuestion && (
        <div className="edit-form">
          <h3>Edit Question</h3>
          <input
            type="text"
            name="question"
            value={editedData.question}
            onChange={handleInputChange}
            placeholder="Enter Question"
          />
          <div className="options">
            <input
              type="text"
              name="options.A"
              value={editedData.options.A}
              onChange={handleInputChange}
              placeholder="Option A"
            />
            <input
              type="text"
              name="options.B"
              value={editedData.options.B}
              onChange={handleInputChange}
              placeholder="Option B"
            />
            <input
              type="text"
              name="options.C"
              value={editedData.options.C}
              onChange={handleInputChange}
              placeholder="Option C"
            />
            <input
              type="text"
              name="options.D"
              value={editedData.options.D}
              onChange={handleInputChange}
              placeholder="Option D"
            />
          </div>
          <input
            type="text"
            name="correctAnswer"
            value={editedData.correctAnswer}
            onChange={handleInputChange}
            placeholder="Correct Answer"
          />
          <input
            type="text"
            name="explanation"
            value={editedData.explanation}
            onChange={handleInputChange}
            placeholder="Explanation"
          />
          <input
            type="text"
            name="courseAmount"
            value={editedData.courseAmount}
            onChange={handleInputChange}
            placeholder="Course Amount"
          />
          <input
            type="text"
            name="courseId"
            value={editedData.courseId}
            onChange={handleInputChange}
            placeholder="Course ID"
          />
          <input
            type="text"
            name="examName"
            value={editedData.examName}
            onChange={handleInputChange}
            placeholder="Exam Name"
          />
          <input
            type="text"
            name="paymentOption"
            value={editedData.paymentOption}
            onChange={handleInputChange}
            placeholder="Payment Option"
          />
          <input
            type="text"
            name="title"
            value={editedData.title}
            onChange={handleInputChange}
            placeholder="Title"
          />
          <input
            type="text"
            name="yearOfExam"
            value={editedData.yearOfExam}
            onChange={handleInputChange}
            placeholder="Year of Exam"
          />
          <button onClick={handleSaveEdit}>Save Changes</button>
        </div>
      )}

      {/* Table with questions */}
      <table className="exam-question-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Option 1</th>
            <th>Option 2</th>
            <th>Option 3</th>
            <th>Option 4</th>
            <th>Correct Answer</th>
            <th>Explanation</th>
            <th>Course Amount</th>
            <th>Course ID</th>
            <th>Exam Name</th>
            <th>Payment Option</th>
            <th>Title</th>
            <th>Year of Exam</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody id="questionTableBody">
          {filteredQuestions.map((question) => (
            <tr key={question.id}>
              <td>{question.question}</td>
              <td>{question.options?.A}</td>
              <td>{question.options?.B}</td>
              <td>{question.options?.C}</td>
              <td>{question.options?.D}</td>
              <td>{question.correctAnswer}</td>
              <td>{question.explanation}</td>
              <td>{question.courseAmount}</td>
              <td>{question.courseId}</td>
              <td>{question.examName}</td>
              <td>{question.paymentOption}</td>
              <td>{question.title}</td>
              <td>{question.yearOfExam}</td>
              <td>
                <button onClick={() => handleEdit(question)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDelete(question.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionManagement;
