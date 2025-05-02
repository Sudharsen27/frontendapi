// // import React, { useState } from 'react';
// // import './App.css';

// // function App() {
// //   const [form, setForm] = useState({ name: '', email: '', phone: '' });
// //   const [cards, setCards] = useState([]);

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// // const handleSubmit = async (e) => {
// //   e.preventDefault();

// //   try {
// //     const response = await fetch('http://localhost:3000/submit', {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify(form),
// //     });

// //     const result = await response.json();

// //     if (result.success) {
// //       setCards([...cards, result.data]); // add new card
// //       setForm({ name: '', email: '', phone: '' }); // clear form
// //     }
// //   } catch (error) {
// //     console.error('Error:', error);
// //   }
// // };
// //   // Removed duplicate fetch logic outside of async function

// //   return (
// //     <div className="App">
// //       <h1>Form Submission</h1>

// //       <form onSubmit={handleSubmit}>
// //         <input
// //           type="text"
// //           name="name"
// //           value={form.name}
// //           onChange={handleChange}
// //           placeholder="Name"
// //           required
// //         /><br />
// //         <input
// //           type="email"
// //           name="email"
// //           value={form.email}
// //           onChange={handleChange}
// //           placeholder="Email"
// //           required
// //         /><br />
// //         <input
// //           type="tel"
// //           name="phone"
// //           value={form.phone}
// //           onChange={handleChange}
// //           placeholder="Phone"
// //           required
// //         /><br />
// //         <button type="submit">Submit</button>
// //       </form>

// //       <h2>Submitted Cards:</h2>
// //       <div>
// //         {cards.map((card, index) => (
// //           <div key={index} style={{
// //             border: '1px solid #ccc',
// //             margin: '10px',
// //             padding: '10px',
// //             borderRadius: '8px',
// //             width: '300px'
// //           }}>
// //             <p><strong>Name:</strong> {card.name}</p>
// //             <p><strong>Email:</strong> {card.email}</p>
// //             <p><strong>Phone:</strong> {card.phone}</p>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // export default App;

// import React, { useState } from 'react';

// function App() {
//   const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
//   const [submittedData, setSubmittedData] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('http://localhost:3000/submit', {
//         method: 'POST',  // Ensure this is POST, not GET
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       if (data.success) {
//         setSubmittedData(data.data);  // Store the response data to display
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Form Submission</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           placeholder="Name"
//         />
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           placeholder="Email"
//         />
//         <input
//           type="text"
//           name="phone"
//           value={formData.phone}
//           onChange={handleChange}
//           placeholder="Phone"
//         />
//         <button type="submit">Submit</button>
//       </form>

//       {submittedData && (
//         <div>
//           <h2>Submitted Data:</h2>
//           <p>Name: {submittedData.name}</p>
//           <p>Email: {submittedData.email}</p>
//           <p>Phone: {submittedData.phone}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Use environment variable for API URL with fallback
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  // Reset status messages after 3 seconds
  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting data to:', `${apiUrl}/submit`);
      
      const response = await fetch(`${apiUrl}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Log the raw response for debugging
      console.log('Response status:', response.status);
      
      // Try to parse the response as JSON
      const result = await response.json();
      console.log('Response data:', result);
      
      if (response.ok && result.success) {
        // Add new submission to the list
        setSubmissions([...submissions, result.data]);
        
        // Reset form
        setFormData({ name: '', email: '', phone: '' });
        
        // Set success status
        setSubmitStatus('success');
      } else {
        // Handle server error responses
        setError(result.message || 'Server returned an error');
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(`Network error: ${error.message} - Please check if the API (${apiUrl}) is accessible`);
      setSubmitStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Test connection to backend
  const testConnection = async () => {
    try {
      const response = await fetch(`${apiUrl}/test`);
      const data = await response.json();
      alert(`Connection test to ${apiUrl}: ${data.message}`);
    } catch (error) {
      alert(`Connection failed to ${apiUrl}: ${error.message}`);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Sowparnika Form Submission</h1>
        <div>
          <small className="api-url">API: {apiUrl}</small>
          <button onClick={testConnection} className="test-button">
            Test API Connection
          </button>
        </div>
      </header>

      <div className="content">
        <div className="form-container">
          <h2>Contact Form</h2>
          
          {error && <div className="error-message">{error}</div>}
          {submitStatus === 'success' && (
            <div className="success-message">Form submitted successfully!</div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>

        <div className="submissions-container">
          <h2>Submitted Entries</h2>
          
          {submissions.length === 0 ? (
            <p>No submissions yet</p>
          ) : (
            <div className="cards-container">
              {submissions.map((submission, index) => (
                <div key={index} className="card">
                  <h3>{submission.name}</h3>
                  <p><strong>Email:</strong> {submission.email}</p>
                  <p><strong>Phone:</strong> {submission.phone}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <footer>
        <p>© 2025 Sowparnika - Delivering Happiness</p>
      </footer>
    </div>
  );
}

export default App;