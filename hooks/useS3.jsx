//import { createPresignedPost, upload, download } from '../../apiClient/operations/s3Operations';
import { saveAs } from 'file-saver';

export default function useS3() {

    const uploadFile = async (file, key) => {
        const encodedKey = encodeURIComponent(key);
        const { url, fields } = await createPresignedPost(encodedKey);
        if (!url || !fields) return null;

        const formData = new FormData();
        Object.entries({ ...fields, file }).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const response = await upload(url, formData);
        if (response.ok) return {
            bucket: fields.bucket,
            key: fields.key
        };
        return null;
    };

    const downloadFile = async (bucket, key, fileName) => {
        const response = await download(bucket, key);
        saveAs(response, fileName);
        return response;
    };

    const fileType = (fileName) => {
        return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
    }

    const renameFile = (file, newName) => {
        return new File([file], newName, {
            type: file.type,
            lastModified: file.lastModified,
        });
    }

    return { uploadFile, downloadFile, fileType, renameFile };
}
