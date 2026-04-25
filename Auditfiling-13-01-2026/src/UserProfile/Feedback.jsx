import React, { useState } from 'react';

const Feedback = () => {
  const [formData, setFormData] = useState({
    rating: 0,
    feedback: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRating = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const getUserIdFromsessionStorage = () => {
    try {
      // Try different possible keys where user data might be stored
      const possibleKeys = ['user', 'userData', 'authUser', 'userInfo', 'currentUser'];

      for (const key of possibleKeys) {
        const userData = sessionStorage.getItem(key);
        if (userData) {
          const parsedData = JSON.parse(userData);
          // Check for user_id in different possible properties
          if (parsedData.user_id) return parsedData.user_id;
          if (parsedData.id) return parsedData.id;
          if (parsedData.userId) return parsedData.userId;
          if (parsedData.uid) return parsedData.uid;
        }
      }

      // If no user data found, check for token and decode it
      const token = sessionStorage.getItem('token') || sessionStorage.getItem('authToken');
      if (token) {
        // Simple token decoding (for JWT tokens)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.user_id) return payload.user_id;
          if (payload.id) return payload.id;
          if (payload.sub) return payload.sub;
        } catch (e) {
          console.log('Token decoding failed:', e);
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting user ID from sessionStorage:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation logic for feedback requirement
    if (formData.rating < 5 && formData.feedback.trim() === '') {
      setError('Please provide a message for ratings below 5 stars.');
      return;
    }

    if (formData.rating === 0) {
      setError('Please select a rating.');
      return;
    }

    // Get user_id from sessionStorage
    const user_id = getUserIdFromsessionStorage();

    if (!user_id) {
      setError('Please log in to submit feedback.');
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        user_id: user_id,
        rating: formData.rating,
        feedback: formData.feedback,
      };

      // console.log('Sending data:', requestData); // For debugging

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/feedback/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      // Check if response is OK before trying to parse as JSON
      if (!response.ok) {
        // Try to get error message from response
        const errorText = await response.text();
        try {
          // Try to parse as JSON first
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Something went wrong');
        } catch (Error) {
          throw new Error('Server error. Please try again later.');
        }
      }

      // If response is OK, parse as JSON
      // const result = await response.json();

      // console.log('Feedback submitted:', result);
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      rating: 0,
      feedback: '',
    });
    setSubmitted(false);
    setError('');
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your feedback has been received. We appreciate you helping us improve.
          </p>
          <button
            onClick={resetForm}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium"
          >
            Submit Another Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 mt-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-serif text-gray-900 mb-2 p-5">
            We Value Your Feedback
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please complete the following form to help us improve your experience.
          </p>
        </div>

        {/* Feedback Form */}
        <div className="bg-white rounded-xl shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                How would you rate your experience? *
              </label>
              <div className="flex justify-center space-x-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    className={`p-3 rounded-full transition duration-200 ${formData.rating >= star
                      ? 'bg-yellow-100 text-yellow-500'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              <div className="text-center mt-2 text-sm text-gray-500">
                {formData.rating === 0
                  ? 'Select a rating'
                  : `${formData.rating} out of 5 stars`}
              </div>
            </div>

            {/* Feedback */}
            <div>
              <label
                htmlFor="feedback"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Feedback {formData.rating < 5 && <span className="text-red-500">*</span>}
              </label>
              <textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg transition duration-200 resize-none"
                placeholder={
                  formData.rating === 5
                    ? 'Optional — tell us what you loved!'
                    : 'Please share your thoughts, suggestions, or concerns...'
                }
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-green-600 text-white py-3 px-4 rounded-lg focus:ring-offset-2 transition duration-200 font-medium text-lg ${loading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-green-700 focus:ring-2 focus:ring-green-500'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>We read all feedback carefully and use it to improve our services.</p>
          <p className="mt-1">
            Thank you for taking the time to share your thoughts with us.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feedback;