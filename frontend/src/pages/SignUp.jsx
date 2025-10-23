// import { useState } from "react";
import { useForm } from 'react-hook-form';

function SignUp(){
    
  const { register, handleSubmit } = useForm();

  const submitData = (data) =>{ 
    console.log(data)
  };

  return (
    <>
    <form onSubmit={handleSubmit(submitData)}>
      <input {...register('firstName')}
      placeholder='Enter firstName'/>
      <input {...register('email')}
      placeholder='Enter email'/>
      <input {...register('password')}
      placeholder='enter password'/>
      <button type='submit' className='btn btn-sm'>Submit</button>
    </form>
    </>
  )
   
}

export default SignUp;



//  const [name, setName] = useState('');
//     const [email, setEmail ]= useState('');
//     const [password, setPassword] = useState('');

    
//     const handleSubmit = (e) => {
      
//       e.preventDefault();
//       console.log(name, email, password)
      
//     }

//     return (
//         <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-y-3"> 
//           <input type="text" value={name} placeholder="Enter your firstName" onChange={(e) => setName(e.target.value)}></input>
//           <input type="email" value={email} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)}></input>
//           <input type="password" value={password} placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)}></input>
//           <button type="submit">Submit</button>
//         </form>
//     )