// import { useState } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; 

const signUpSchema = z.object({
 
  firstName: z.string().min(3, "Name must be at least 3 characters"),
  emailId: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

function SignUp(){
    
  const { register, handleSubmit, formState: {errors},} = useForm({resolver:zodResolver(signUpSchema)});

  const submitData = (data) =>{ 
    console.log(data)
  };

  return (
    <>
    <form onSubmit={handleSubmit(submitData)} className='min-h-screen flex flex-col justify-center items-center gap-y-2 max-w-xl ml-20'>
      <input {...register('firstName')} placeholder='Enter firstName'/> 
      {errors.firstName && (<span>{errors.firstName.message}</span>)}

      <input {...register('emailId')} placeholder='Enter email'/>
      {errors.emailId && (<span>{errors.emailId.message}</span>)}
      
      <input {...register('password')} placeholder='enter password'/>
      {errors.password && (<span>{errors.password.message}</span>)}

      <button type='submit' className='btn btn-sm'>Submit</button>
    </form>
    </>
  )
   
}

export default SignUp;
