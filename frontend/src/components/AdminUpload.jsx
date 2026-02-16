import { useParams } from 'react-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';

const AdminUplaod = async () => {
    
    const { problemId } = useParams();

    const [ uploading, setUploading ] = useState(false);
    const [ uploadProgress, setUploadProgress ] = useState(0);
    // to handle meta data of cloudinary
    const [ uploadedVideo, setUploadedVideo ] = useState(null);

    const { 
       register,
       handleSubmit,
       watch,
       reset,
       setError,
       clearErrors,
       formState: { errors},
    } = useForm();
    

    const selectedFile = watch('videoFile')?.[0];


    const onSubmit = async (data) => {

       const file = data.videofile[0];
       
       setUploading(true);
       setUploadProgress(0);
       clearErrors();
        
       try{
           // get signture from backend 
           const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
           const {signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse;

           const formData = new FormData();
           formData.append('file', file);
           formData.append('signature', signature);
           formData.append('timestamp', timestamp);
           formData.append('public_id', public_id);
           formData.append('api_key', api_key);

           // upload directly to cloudinary via frontend
           const  uploadResponse = await axios.post(upload_url, formData, {
              headers:{
                'Content-Type': 'multipart/form-data',
              },
              onDownloadProgress: (progressEvent) => {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(progress);
              }
           })
           
           const cloudinaryResult = uploadResponse.data;

           
        }
       catch(err){
           console.log("error:",err);
       }

    }

    return(
        <>upload video{problemId}</>
    )
}

export default AdminUplaod;