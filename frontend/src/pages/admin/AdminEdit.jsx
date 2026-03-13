import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router';
import axiosClient from '../../utils/axiosClient';
import problemSchema from '../../utils/problemSchema';

function AdminEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } =
    useFieldArray({ control, name: 'visibleTestCases' });

  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } =
    useFieldArray({ control, name: 'hiddenTestCases' });

  // Fetch problem and prefill form
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await axiosClient.get(`/problem/problemById/${id}`);
        reset(data);
      } catch (err) {
        alert('Failed to load problem');
        console.error(err);
      }
    };

    fetchProblem();
  }, [id, reset]);

  // Update submit
  const onSubmit = async (formData) => {
    try {
      await axiosClient.put(`/problem/update/${id}`, formData);
      alert('Problem updated successfully!');
      navigate('/admin/update');
    } catch (err) {
      alert('Update failed');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Update Problem</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Title */}
        <input
          {...register('title')}
          className="input input-bordered w-full"
          placeholder="Title"
        />
        {errors.title && <p className="text-error">{errors.title.message}</p>}

        {/* Description */}
        <textarea
          {...register('description')}
          className="textarea textarea-bordered w-full"
          placeholder="Description"
        />

        {/* Difficulty */}
        <select {...register('difficulty')} className="select select-bordered">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Visible Test Cases */}
        <h3 className="font-semibold">Visible Test Cases</h3>
        {visibleFields.map((_, index) => (
          <div key={index} className="border p-4 rounded">
            <input {...register(`visibleTestCases.${index}.input`)} className="input w-full" />
            <input {...register(`visibleTestCases.${index}.output`)} className="input w-full" />
            <textarea {...register(`visibleTestCases.${index}.explanation`)} className="textarea w-full" />
            <button type="button" onClick={() => removeVisible(index)}>Remove</button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
          className="btn btn-sm"
        >
          Add Visible
        </button>

        {/* Hidden Test Cases */}
        <h3 className="font-semibold">Hidden Test Cases</h3>
        {hiddenFields.map((_, index) => (
          <div key={index} className="border p-4 rounded">
            <input {...register(`hiddenTestCases.${index}.input`)} className="input w-full" />
            <input {...register(`hiddenTestCases.${index}.output`)} className="input w-full" />
            <button type="button" onClick={() => removeHidden(index)}>Remove</button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => appendHidden({ input: '', output: '' })}
          className="btn btn-sm"
        >
          Add Hidden
        </button>

        {/* Update Button */}
        <button type="submit" className="btn btn-warning w-full">
          Update Problem
        </button>

      </form>
    </div>
  );
}

export default AdminEdit;
