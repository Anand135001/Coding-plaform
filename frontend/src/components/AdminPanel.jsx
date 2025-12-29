import { useNavigate } from 'react-router';
import axiosClient from '../utils/axiosClient';
import ProblemForm from './ProblemForm';

function AdminPanel() {
  const navigate = useNavigate();

  const defaultValues = {
    startCode: [
      { language: 'C++', initialCode: '' },
      { language: 'Java', initialCode: '' },
      { language: 'JavaScript', initialCode: '' }
    ],
    referenceSolution: [
      { language: 'C++', completeCode: '' },
      { language: 'Java', completeCode: '' },
      { language: 'JavaScript', completeCode: '' }
    ],
    visibleTestCases: [
      { input: '', output: '', explanation: '' }
    ],
    hiddenTestCases: [
      { input: '', output: '' }
    ]
  };

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Problem</h1>
      <ProblemForm 
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        submitText="Create Problem"
      />
    </div>
  );
}

export default AdminPanel;