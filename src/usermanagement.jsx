import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Correct Firebase import
import { collection, getDocs } from 'firebase/firestore'; // Firestore imports
import './usermanagement.css'; // Import the reusable CSS file

const UserManage = () => {
  const [usersData, setUsersData] = useState([]);

  // Function to format timestamp (if needed)
  const formatTimestamp = (timestamp) => {
    if (timestamp) {
      const date = new Date(timestamp.seconds * 1000); // Convert Firebase timestamp to Date
      return date.toLocaleString(); // Format the date to a readable string
    }
    return 'N/A';
  };

  // Fetch data from Firestore when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const data = [];

        // Fetch user data
        for (const docSnapshot of querySnapshot.docs) {
          const userId = docSnapshot.id;
          const userData = docSnapshot.data();

          // Log user data for debugging
          console.log('User Data:', userData);

          // Fetch courses for each user
          const coursesSnapshot = await getDocs(collection(db, `users/${userId}/courses`));
          const courses = {};

          coursesSnapshot.forEach((courseDoc) => {
            const courseId = courseDoc.id;
            const courseData = courseDoc.data();
            courses[courseId] = courseData;
          });

          // Fetch questionbank for each user
          const questionbankSnapshot = await getDocs(collection(db, `users/${userId}/questionbank`));
          const questionbank = {};

          questionbankSnapshot.forEach((questionDoc) => {
            const questionId = questionDoc.id;
            const questionData = questionDoc.data();
            questionbank[questionId] = {
              amount: questionData.amount,
              examTitle: questionData.examTitle,
              paymentId: questionData.paymentId,
              questionYear: questionData.questionYear,
              timestamp: questionData.timestamp,
              userEmail: questionData. userEmail,
            };
          });

          // Store user data with courses and questionbank
          data.push({
            id: userId,
            email: userData.email,
            name: userData.name,
            address: userData. address,
            phone: userData. phone,
          
            questionbank: questionbank,
          });
        }

        setUsersData(data);
      } catch (err) {
        console.error('Error fetching data: ', err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="user-management">
      <h2 className="user-management-title">User Management</h2>

      <div className="user-management-data">
        <h3 className="user-management-data-title">Users Data</h3>
        <table className="user-management-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Email</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              
              <th>Questionbank</th>
            </tr>
          </thead>
          <tbody>
            {usersData.length > 0 ? (
              usersData.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td>{user.address}</td>
                  <td>{user.phone}</td>
                  
                 
                  <td>
                    {user.questionbank && Object.keys(user.questionbank).length > 0 ? (
                      Object.entries(user.questionbank).map(([questionId, question]) => (
                        <div key={questionId}>
                          <p><strong>Question ID:</strong> {questionId}</p>
                          <p><strong>Amount:</strong> {question.amount}</p>
                          <p><strong>Exam Title:</strong> {question.examTitle}</p>
                          <p><strong>Payment ID:</strong> {question.paymentId}</p>
                          <p><strong>Question Year:</strong> {question.questionYear}</p>
                          <p><strong>email:</strong> {question.userEmail}</p>
                         
                          <p><strong>Timestamp:</strong> {formatTimestamp(question.timestamp)}</p>
                          <hr />
                        </div>
                      ))
                    ) : (
                      'No questions available'
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManage;
