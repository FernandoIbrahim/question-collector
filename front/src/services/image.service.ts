import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API;

export async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
  
    try {

      const response = await axios.post(apiUrl + "/upload-images", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('✅ Imagem enviada com sucesso:', response.data);
      return response.data;

    } catch (error) {

      console.error('❌ Erro ao enviar imagem:', error);
      throw error;
    }

  }