import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from './firebase'; // import the Firestore instance

const Dashboard = () => {
  // State to store the total number of users (emails)
  const [totalUsers, setTotalUsers] = useState(0);

  // Function to fetch users from Firestore
  const fetchUserEmails = async () => {
    try {
      // Reference to the 'users' collection in Firestore
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);

      // Extract the number of emails from each user document
      const userEmails = querySnapshot.docs.map(doc => doc.data().email);
      
      // Set the number of users in the state
      setTotalUsers(userEmails.length);
    } catch (error) {
      console.error('Error fetching user emails: ', error);
    }
  };

  // Use effect to fetch data on component mount
  useEffect(() => {
    fetchUserEmails();
  }, []);

  return (
    <div className="content-area">
      <h2>Welcome to Genius Quizzes Admin Panel</h2>
      <p>Total Number of App Users (Emails): {totalUsers}</p>
    </div>
  );
};

export default Dashboard;
