import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axiosClient from '../utils/axiosClient';
import ProblemForm from './ProblemForm';

const UpdateProblem = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProblem();
  }, [problemId]);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/problem/problemById/${problemId}`);
      console.log("data is here", data);
      // Transform the data to match the form structure
      const formattedData = {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        tags: data.tags,
        visibleTestCases: data.visibleTestCases || [{ input: '', output: '', explanation: '' }],
        hiddenTestCases: data.hiddenTestCases || [{ input: '', output: '' }],
        startCode: data.startCode || [
          { language: 'C++', initialCode: '' },
          { language: 'Java', initialCode: '' },
          { language: 'JavaScript', initialCode: '' }
        ],
        referenceSolution: data.referenceSolution || [
          { language: 'C++', completeCode: '' },
          { language: 'Java', completeCode: '' },
          { language: 'JavaScript', completeCode: '' }
        ]
      };
      
      setProblem(formattedData);
    } catch (err) {
      setError('Failed to fetch problem');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      console.log("problem id here: ",problemId)
      await axiosClient.put(`/problem/update/${problemId}`, data);
      alert('Problem updated successfully!');
      navigate('/admin/update');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error shadow-lg my-4">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
        <button 
          onClick={() => navigate('/admin/update')}
          className="btn btn-primary"
        >
          Back to Problems List
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Update Problem</h1>
        <button 
          onClick={() => navigate('/admin/update')}
          className="btn btn-outline"
        >
          Back to Problems List
        </button>
      </div>
      
      {problem && (
        <ProblemForm 
          onSubmit={handleSubmit}
          defaultValues={problem}
          isSubmitting={isSubmitting}
          submitText="Update Problem"
        />
      )}
    </div>
  );
};

export default UpdateProblem;